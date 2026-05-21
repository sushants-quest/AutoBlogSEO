'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

const trafficData = [
  { month: 'Jan', traffic: 2400 },
  { month: 'Feb', traffic: 2800 },
  { month: 'Mar', traffic: 3200 },
  { month: 'Apr', traffic: 3800 },
  { month: 'May', traffic: 4200 },
  { month: 'Jun', traffic: 4891 },
]

const contentStatusData = [
  { status: 'Brief', count: 4 },
  { status: 'Draft', count: 3 },
  { status: 'Review', count: 3 },
  { status: 'Published', count: 8 },
]

const trafficSourcesData = [
  { name: 'Organic', value: 65 },
  { name: 'Direct', value: 20 },
  { name: 'Social', value: 10 },
  { name: 'Referral', value: 5 },
]

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444']

export function TrafficChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Organic Traffic</h3>
        <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="traffic"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={{ fill: '#6366F1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function ContentStatusChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Content by Status</h3>
        <p className="text-xs text-slate-500 mt-0.5">Current pipeline</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={contentStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TrafficSourcesChart() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Traffic Sources</h3>
        <p className="text-xs text-slate-500 mt-0.5">Distribution</p>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie
              data={trafficSourcesData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {trafficSourcesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              formatter={(value) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {trafficSourcesData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-xs text-slate-600">{item.name}</span>
              <span className="text-xs font-semibold text-slate-900 ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
