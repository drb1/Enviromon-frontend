'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
} from 'chart.js'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Title, Tooltip)

type SensorPoint = {
  temperature: number
  humidity: number
  timestamp: string
}

export default function SensorChart({ data }: { data: SensorPoint[] }) {
  const labels = data?.map(point => new Date(point.timestamp).toLocaleTimeString())
  const temperatureData = data?.map(point => point.temperature)
  const humidityData = data?.map(point => point.humidity)

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatureData,
        fill: false,
        borderColor: 'red',
        tension: 0.3
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        fill: false,
        borderColor: 'blue',
        tension: 0.3
      }
    ]
  }

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-3xl">
      <Line data={chartData} />
    </div>
  )
}
