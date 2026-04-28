'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

export function PerformanceLineChart({ marks }) {
  const sorted = [...marks].sort((a, b) => a.semester - b.semester);
  const labels = sorted.map(m => `Sem ${m.semester}`);
  const values = sorted.map(m => parseFloat(m.marks));

  const data = {
    labels,
    datasets: [
      {
        label: 'Marks',
        data: values,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 40, 0.95)',
        titleColor: '#f0f0f5',
        bodyColor: '#9898b0',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => `Marks: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(139, 92, 246, 0.06)' },
        ticks: { color: '#5a5a70', font: { family: 'Inter' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#5a5a70', font: { family: 'Inter' } },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon cyan">📈</div>
          Performance Trend
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}

export function PerformanceBarChart({ marks }) {
  const sorted = [...marks].sort((a, b) => a.semester - b.semester);
  const labels = sorted.map(m => `Sem ${m.semester}`);
  const values = sorted.map(m => parseFloat(m.marks));

  const colors = values.map(v =>
    v >= 75 ? 'rgba(16, 185, 129, 0.7)' :
    v >= 50 ? 'rgba(245, 158, 11, 0.7)' :
    'rgba(239, 68, 68, 0.7)'
  );
  const borderColors = values.map(v =>
    v >= 75 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Marks',
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 40, 0.95)',
        titleColor: '#f0f0f5',
        bodyColor: '#9898b0',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => `Marks: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        grid: { color: 'rgba(139, 92, 246, 0.06)' },
        ticks: { color: '#5a5a70', font: { family: 'Inter' } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#5a5a70', font: { family: 'Inter' } },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <div className="card-header">
        <div className="card-title">
          <div className="card-icon green">📊</div>
          Semester Comparison
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}
