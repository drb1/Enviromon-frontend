'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  distance: number;
  timestamp: string;
}

interface Alert {
  message: string;
  timestamp: string;
}

export default function Dashboard() {
  const [latest, setLatest] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Fetch data from FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Latest data
        const latestRes = await fetch(`${process.env.NEXT_PUBLIC_API}/latest`);
        const latestData = await latestRes.json();
        setLatest(latestData);

        // Historical data
        const historyRes = await fetch(`${process.env.NEXT_PUBLIC_API}/history`);
        const historyData = await historyRes.json();
        setHistory(historyData);

        // Alerts
        const alertsRes = await fetch(`${process.env.NEXT_PUBLIC_API}/alerts`);
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Chart data
  const chartData = {
    labels: history.map((d) => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: history.map((d) => d.temperature),
        borderColor: '#3b82f6',
        fill: false,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">EnviroMon Dashboard</h1>

      {/* Real-time Data */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Real-Time Readings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-red-500">Temperature</h3>
                <p className="text-2xl text-green-700">{latest.temperature} °C</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-red-500">Humidity</h3>
                <p className="text-2xl text-green-700">{latest.humidity} %</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-red-500">Light</h3>
                <p className="text-2xl text-green-700">{latest.light} %</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-red-500">Distance</h3>
                <p className="text-text-green-700 ">{latest.distance} cm</p>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>

      {/* Historical Trends */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Historical Trends</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </section>

      {/* Alert Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Alert Logs</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="p-3">{alert.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}