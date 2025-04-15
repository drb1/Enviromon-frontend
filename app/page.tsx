'use client'

import SensorChart from '@/components/SensorChart'
import { useEffect, useState } from 'react'

type SensorData = {
  temperature: number | null
  humidity: number | null
}
type SensorPoint = {
  temperature: number
  humidity: number
  timestamp: string
}

export default function Home() {
  const [data, setData] = useState<SensorData>({ temperature: null, humidity: null })
  const [history, setHistory] = useState<SensorPoint[]>([])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/history`)
      const json = await res.json()
      setHistory(json)
    } catch (err) {
      console.error('Error fetching history:', err)
    }
  }
  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/latest`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  useEffect(() => {
    fetchData();
    fetchHistory();
    const interval = setInterval(fetchData, 5000) // refresh every 5s
    return () => clearInterval(interval)
  }, [])
console.log('data',data)
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-green-900">🌤️ Enviromon Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded shadow text-center">
          <p className="text-xl text-green-900">🌡️ Temperature</p>
          <p className="text-2xl font-semibold text-red-500">
            {data.temperature !== null ? `${data.temperature} °C` : 'Loading...'}
          </p>
        </div>
        <div className="p-6 bg-white rounded shadow text-center">
          <p className="text-xl text-green-900">💧 Humidity</p>
          <p className="text-2xl font-semibold text-blue-500">
            {data.humidity !== null ? `${data.humidity} %` : 'Loading...'}
          </p>
        </div>

      </div>
      <SensorChart data={history} />

    </main>
  )
}
