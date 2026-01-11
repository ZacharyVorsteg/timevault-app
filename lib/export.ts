import { Activity, Project, Category, DailySummary } from './types';
import { getActivitiesByDateRange, getAllProjects, getAllCategories } from './db';

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

// Format duration as decimal hours for billing
export function formatDecimalHours(seconds: number): string {
  return (seconds / 3600).toFixed(2);
}

// Generate CSV export
export async function exportToCSV(
  startDate: Date,
  endDate: Date,
  options: {
    includeProjects?: boolean;
    includeCategories?: boolean;
    groupBy?: 'day' | 'project' | 'category' | 'none';
  } = {}
): Promise<string> {
  const activities = await getActivitiesByDateRange(startDate, endDate);
  const projects = await getAllProjects();
  const categories = await getAllCategories();

  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const headers = [
    'Date',
    'Start Time',
    'End Time',
    'Duration (seconds)',
    'Duration (formatted)',
    'App Name',
    'Window Title',
  ];

  if (options.includeProjects) {
    headers.push('Project', 'Billable', 'Hourly Rate');
  }
  if (options.includeCategories) {
    headers.push('Category', 'Category Type');
  }

  const rows: string[][] = [headers];

  for (const activity of activities) {
    const row = [
      new Date(activity.startTime).toLocaleDateString(),
      new Date(activity.startTime).toLocaleTimeString(),
      activity.endTime ? new Date(activity.endTime).toLocaleTimeString() : '',
      activity.duration.toString(),
      formatDuration(activity.duration),
      activity.appName,
      activity.windowTitle,
    ];

    if (options.includeProjects) {
      const project = activity.projectId ? projectMap.get(activity.projectId) : null;
      row.push(
        project?.name || '',
        project?.isBillable ? 'Yes' : 'No',
        project?.hourlyRate?.toString() || ''
      );
    }

    if (options.includeCategories) {
      const category = categoryMap.get(activity.categoryId);
      row.push(category?.name || 'Uncategorized', category?.type || 'neutral');
    }

    rows.push(row);
  }

  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

// Generate daily summaries
export async function generateDailySummaries(
  startDate: Date,
  endDate: Date
): Promise<DailySummary[]> {
  const activities = await getActivitiesByDateRange(startDate, endDate);
  const categories = await getAllCategories();

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const summaryMap = new Map<string, DailySummary>();

  for (const activity of activities) {
    const dateKey = new Date(activity.startTime).toISOString().split('T')[0];

    if (!summaryMap.has(dateKey)) {
      summaryMap.set(dateKey, {
        date: dateKey,
        totalTime: 0,
        productiveTime: 0,
        neutralTime: 0,
        distractionTime: 0,
        topApps: [],
        topCategories: [],
        topProjects: [],
      });
    }

    const summary = summaryMap.get(dateKey)!;
    summary.totalTime += activity.duration;

    const category = categoryMap.get(activity.categoryId);
    if (category) {
      switch (category.type) {
        case 'productive':
          summary.productiveTime += activity.duration;
          break;
        case 'neutral':
          summary.neutralTime += activity.duration;
          break;
        case 'distraction':
          summary.distractionTime += activity.duration;
          break;
      }
    }

    // Aggregate top apps
    const existingApp = summary.topApps.find((a) => a.appName === activity.appName);
    if (existingApp) {
      existingApp.duration += activity.duration;
    } else {
      summary.topApps.push({ appName: activity.appName, duration: activity.duration });
    }

    // Aggregate top categories
    const existingCategory = summary.topCategories.find(
      (c) => c.categoryId === activity.categoryId
    );
    if (existingCategory) {
      existingCategory.duration += activity.duration;
    } else {
      summary.topCategories.push({
        categoryId: activity.categoryId,
        duration: activity.duration,
      });
    }

    // Aggregate top projects
    if (activity.projectId) {
      const existingProject = summary.topProjects.find(
        (p) => p.projectId === activity.projectId
      );
      if (existingProject) {
        existingProject.duration += activity.duration;
      } else {
        summary.topProjects.push({
          projectId: activity.projectId,
          duration: activity.duration,
        });
      }
    }
  }

  // Sort aggregates
  Array.from(summaryMap.values()).forEach((summary) => {
    summary.topApps.sort((a, b) => b.duration - a.duration);
    summary.topCategories.sort((a, b) => b.duration - a.duration);
    summary.topProjects.sort((a, b) => b.duration - a.duration);
  });

  return Array.from(summaryMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate productivity score
export function calculateProductivityScore(summary: DailySummary): number {
  const totalRelevant = summary.productiveTime + summary.distractionTime;
  if (totalRelevant === 0) return 0;
  return Math.round((summary.productiveTime / totalRelevant) * 100);
}

// Generate billable hours report
export async function generateBillableReport(
  startDate: Date,
  endDate: Date
): Promise<{
  projects: {
    project: Project;
    totalSeconds: number;
    billableAmount: number;
  }[];
  totalSeconds: number;
  totalBillable: number;
}> {
  const activities = await getActivitiesByDateRange(startDate, endDate);
  const projects = await getAllProjects();

  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const projectTotals = new Map<string, number>();

  for (const activity of activities) {
    if (activity.projectId) {
      const current = projectTotals.get(activity.projectId) || 0;
      projectTotals.set(activity.projectId, current + activity.duration);
    }
  }

  const projectReports: {
    project: Project;
    totalSeconds: number;
    billableAmount: number;
  }[] = [];

  let totalSeconds = 0;
  let totalBillable = 0;

  Array.from(projectTotals.entries()).forEach(([projectId, seconds]) => {
    const project = projectMap.get(projectId);
    if (project) {
      const hours = seconds / 3600;
      const billable = project.isBillable && project.hourlyRate ? hours * project.hourlyRate : 0;

      projectReports.push({
        project,
        totalSeconds: seconds,
        billableAmount: billable,
      });

      totalSeconds += seconds;
      if (project.isBillable) {
        totalBillable += billable;
      }
    }
  });

  projectReports.sort((a, b) => b.totalSeconds - a.totalSeconds);

  return { projects: projectReports, totalSeconds, totalBillable };
}

// Generate PDF invoice HTML (to be converted to PDF)
export async function generateInvoiceHTML(
  startDate: Date,
  endDate: Date,
  clientInfo: {
    name: string;
    address?: string;
    email?: string;
  },
  freelancerInfo: {
    name: string;
    address?: string;
    email?: string;
  },
  invoiceNumber: string
): Promise<string> {
  const billableReport = await generateBillableReport(startDate, endDate);

  const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const lineItems = billableReport.projects
    .filter((p) => p.project.isBillable)
    .map(
      (p) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${p.project.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatDecimalHours(p.totalSeconds)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${p.project.hourlyRate?.toFixed(2) || '0.00'}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${p.billableAmount.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #1f2937;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #3b82f6;
    }
    .invoice-meta {
      text-align: right;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .party {
      width: 45%;
    }
    .party h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    th:not(:first-child) {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-top: 1px solid #e5e7eb;
    }
    .total-row.grand {
      font-size: 20px;
      font-weight: bold;
      border-top: 2px solid #1f2937;
      padding-top: 12px;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="invoice-title">INVOICE</div>
    <div class="invoice-meta">
      <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
      <div><strong>Date:</strong> ${formatDate(new Date())}</div>
      <div><strong>Period:</strong> ${formatDate(startDate)} - ${formatDate(endDate)}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>From</h3>
      <div><strong>${freelancerInfo.name}</strong></div>
      ${freelancerInfo.address ? `<div>${freelancerInfo.address}</div>` : ''}
      ${freelancerInfo.email ? `<div>${freelancerInfo.email}</div>` : ''}
    </div>
    <div class="party">
      <h3>Bill To</h3>
      <div><strong>${clientInfo.name}</strong></div>
      ${clientInfo.address ? `<div>${clientInfo.address}</div>` : ''}
      ${clientInfo.email ? `<div>${clientInfo.email}</div>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Hours</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${lineItems}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Total Hours:</span>
      <span>${formatDecimalHours(billableReport.totalSeconds)}</span>
    </div>
    <div class="total-row grand">
      <span>Total Due:</span>
      <span>$${billableReport.totalBillable.toFixed(2)}</span>
    </div>
  </div>

  <div class="footer">
    <p>Generated by TimeVault - Privacy-first time tracking</p>
    <p>This invoice was generated locally on your device. No data was sent to any server.</p>
  </div>
</body>
</html>
  `.trim();
}

// Download helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export all data as JSON
export async function exportAllDataJSON(): Promise<string> {
  const { exportAllData } = await import('./db');
  const data = await exportAllData();
  return JSON.stringify(data, null, 2);
}

// Print/save as PDF
export function printInvoice(html: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
