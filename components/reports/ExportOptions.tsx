'use client';

import React, { useState } from 'react';
import { Button, Card, Modal, Input, Toggle } from '@/components/ui';
import { Activity, Project, Category } from '@/lib/types';
import {
  exportToCSV,
  generateInvoiceHTML,
  downloadFile,
  printInvoice,
} from '@/lib/export';
import { hasFeature } from '@/lib/stripe';

interface ExportOptionsProps {
  activities: Activity[];
  projects: Project[];
  categories: Category[];
  startDate: Date;
  endDate: Date;
  licenseTier: 'free' | 'personal' | 'pro';
}

export function ExportOptions({
  activities,
  projects,
  categories,
  startDate,
  endDate,
  licenseTier,
}: ExportOptionsProps) {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Invoice form state
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [freelancerName, setFreelancerName] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [freelancerEmail, setFreelancerEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${Date.now().toString(36).toUpperCase()}`
  );

  const canExportCSV = hasFeature(licenseTier, 'csv-export');
  const canGeneratePDF = hasFeature(licenseTier, 'pdf-invoice');

  const handleExportCSV = async () => {
    if (!canExportCSV) return;

    setIsExporting(true);
    try {
      const csv = await exportToCSV(startDate, endDate, {
        includeProjects: true,
        includeCategories: true,
      });
      const filename = `timevault-export-${startDate.toISOString().split('T')[0]}-to-${
        endDate.toISOString().split('T')[0]
      }.csv`;
      downloadFile(csv, filename, 'text/csv');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!canGeneratePDF || !clientName || !freelancerName) return;

    setIsExporting(true);
    try {
      const html = await generateInvoiceHTML(
        startDate,
        endDate,
        {
          name: clientName,
          address: clientAddress,
          email: clientEmail,
        },
        {
          name: freelancerName,
          address: freelancerAddress,
          email: freelancerEmail,
        },
        invoiceNumber
      );
      printInvoice(html);
      setIsInvoiceModalOpen(false);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export</h3>

        <div className="space-y-3">
          {/* CSV Export */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export to CSV</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download all activities as a spreadsheet
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              disabled={!canExportCSV || isExporting}
              isLoading={isExporting}
            >
              {canExportCSV ? 'Download' : 'Upgrade'}
            </Button>
          </div>

          {/* PDF Invoice */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Generate Invoice</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create a PDF invoice for billable hours
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsInvoiceModalOpen(true)}
              disabled={!canGeneratePDF}
            >
              {canGeneratePDF ? 'Create' : 'Pro Only'}
            </Button>
          </div>

          {/* JSON Export - always available */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export All Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download your complete database as JSON
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={async () => {
                const { exportAllData } = await import('@/lib/db');
                const data = await exportAllData();
                downloadFile(
                  JSON.stringify(data, null, 2),
                  'timevault-backup.json',
                  'application/json'
                );
              }}
            >
              Backup
            </Button>
          </div>
        </div>
      </Card>

      {/* Invoice Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title="Generate Invoice"
        size="lg"
      >
        <div className="space-y-6">
          {/* Your Info */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Your Information</h4>
            <div className="space-y-3">
              <Input
                label="Your Name / Business"
                value={freelancerName}
                onChange={(e) => setFreelancerName(e.target.value)}
                placeholder="John Doe Consulting"
              />
              <Input
                label="Address (optional)"
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
                placeholder="123 Main St, City, State"
              />
              <Input
                label="Email (optional)"
                value={freelancerEmail}
                onChange={(e) => setFreelancerEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Client Info */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Client Information</h4>
            <div className="space-y-3">
              <Input
                label="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Acme Corp"
              />
              <Input
                label="Address (optional)"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="456 Business Ave"
              />
              <Input
                label="Email (optional)"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="billing@client.com"
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <Input
              label="Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" onClick={() => setIsInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateInvoice}
              disabled={!clientName || !freelancerName || isExporting}
              isLoading={isExporting}
            >
              Generate Invoice
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
