import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatsChartProps {
  data: {
    date: string;
    totalOrders: number;
    totalAmount: number;
  }[];
}

const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const ordersPoints = data.map((item, index) => ({ x: index, y: item.totalOrders }));
  const amountsPoints = data.map((item, index) => ({ x: index, y: item.totalAmount }));
  const labels = data.map(item => item.date);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Orders',
        data: ordersPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        pointRadius: 5,
        showLine: true, 
        borderWidth: 2,
      },
      {
        label: 'Total Amount',
        data: amountsPoints,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        pointRadius: 5,
        showLine: true,
        borderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category' as const, 
        labels: labels, 
        ticks: {
          autoSkip: false,
          maxTicksLimit: Math.min(labels.length, 10),
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Orders & Total Amount',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default StatsChart;
