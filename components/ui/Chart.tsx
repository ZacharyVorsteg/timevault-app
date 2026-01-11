'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

interface BaseChartProps {
  data: ChartData;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        padding: 16,
        usePointStyle: true,
      },
    },
  },
};

export function PieChart({ data, height = 300, showLegend = true, className = '' }: BaseChartProps) {
  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        display: showLegend,
      },
    },
  };

  return (
    <div className={className} style={{ height }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export function DoughnutChart({ data, height = 300, showLegend = true, className = '' }: BaseChartProps) {
  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        display: showLegend,
      },
    },
    cutout: '60%',
  };

  return (
    <div className={className} style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function BarChart({ data, height = 300, showLegend = true, className = '' }: BaseChartProps) {
  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        display: showLegend,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={className} style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function LineChart({ data, height = 300, showLegend = true, className = '' }: BaseChartProps) {
  const options = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        display: showLegend,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={className} style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}

// Productivity colors
export const PRODUCTIVITY_COLORS = {
  productive: '#22c55e',
  neutral: '#f59e0b',
  distraction: '#ef4444',
};

// Generate colors for multiple categories
export function generateColors(count: number): string[] {
  const baseColors = [
    '#3b82f6', // blue
    '#22c55e', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#84cc16', // lime
    '#f97316', // orange
    '#6366f1', // indigo
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
}
