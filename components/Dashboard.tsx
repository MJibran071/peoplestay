import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, BedDouble, MessageCircle, AlertTriangle } from 'lucide-react';
import { mockBookings } from '../constants';

const occupancyData = [
  { name: 'Jan', occupancy: 65 }, { name: 'Feb', occupancy: 70 },
  { name: 'Mar', occupancy: 75 }, { name: 'Apr', occupancy: 82 },
  { name: 'May', occupancy: 85 }, { name: 'Jun', occupancy: 90 },
  { name: 'Jul', occupancy: 95 },
];

const revenueData = [
    { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 7500 },
    { name: 'Jul', revenue: 9000 },
];


const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, change: string, changeType: 'increase' | 'decrease' }> = ({ icon: Icon, title, value, change, changeType }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-start justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            <div className={`flex items-center mt-2 text-xs font-medium ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {change} vs last month
            </div>
        </div>
        <div className="bg-sky-100 text-sky-600 rounded-full p-3">
            <Icon className="w-6 h-6" />
        </div>
    </div>
);


const Dashboard: React.FC = () => {
  const recentBookings = mockBookings.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, Alex!</h1>
        <p className="text-slate-500 mt-1">Here's your property management overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} title="Total Revenue" value="$48.6k" change="+12.5%" changeType="increase" />
        <StatCard icon={BedDouble} title="Total Bookings" value="257" change="+8.2%" changeType="increase" />
        <StatCard icon={MessageCircle} title="New Messages" value="12" change="-5.1%" changeType="decrease" />
        <StatCard icon={AlertTriangle} title="Open Issues" value="3" change="+2" changeType="increase" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `$${Number(value)/1000}k`}/>
                    <Tooltip cursor={{fill: 'rgba(14, 165, 233, 0.1)'}} contentStyle={{borderRadius: '12px', borderColor: '#e2e8f0'}}/>
                    <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Occupancy Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
                 <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `${value}%`}/>
                    <Tooltip contentStyle={{borderRadius: '12px', borderColor: '#e2e8f0'}}/>
                    <Line type="monotone" dataKey="occupancy" stroke="#0ea5e9" strokeWidth={3} dot={{r: 6, fill: '#0ea5e9'}} activeDot={{ r: 8, stroke: '#0ea5e9', strokeWidth: 2, fill: 'white' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs text-slate-500 uppercase border-b border-slate-200">
                        <th className="py-3 px-4">Guest</th>
                        <th className="py-3 px-4">Property</th>
                        <th className="py-3 px-4">Dates</th>
                        <th className="py-3 px-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-zinc-100/50">
                            <td className="py-3 px-4">
                                <div className="flex items-center">
                                    <img src={booking.avatarUrl} alt={booking.guestName} className="w-8 h-8 rounded-full mr-3" />
                                    <span className="font-medium">{booking.guestName}</span>
                                </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{booking.property}</td>
                            <td className="py-3 px-4 text-slate-600">{booking.checkIn} to {booking.checkOut}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>{booking.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;