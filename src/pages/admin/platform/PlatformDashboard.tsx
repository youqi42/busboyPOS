import React from 'react';
import { Link } from 'react-router-dom';

const PlatformDashboard: React.FC = () => {
  // Mock data for platform stats
  const stats = [
    { label: 'Total Restaurants', value: '32', change: '+3', trend: 'up' },
    { label: 'Platform Revenue', value: '$12,540.00', change: '+15.8%', trend: 'up' },
    { label: 'Active Users', value: '1,248', change: '+22.4%', trend: 'up' },
    { label: 'Pending Approvals', value: '5', change: '', trend: 'neutral' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
          <div>
            <Link to="/platform/settings" className="btn-outline">Platform Settings</Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              {stat.change && (
                <p className={`mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.trend === 'up' && '↑ '}
                  {stat.trend === 'down' && '↓ '}
                  {stat.change} from last month
                </p>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick access section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/platform/restaurants" className="block bg-white p-6 rounded-lg shadow border-l-4 border-primary-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Restaurant Management</h3>
            <p className="mt-1 text-sm text-gray-500">Manage all restaurants on the platform</p>
          </Link>
          <Link to="/platform/approvals" className="block bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <p className="mt-1 text-sm text-gray-500">Review and approve new restaurants</p>
          </Link>
          <Link to="/platform/settings" className="block bg-white p-6 rounded-lg shadow border-l-4 border-gray-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Platform Settings</h3>
            <p className="mt-1 text-sm text-gray-500">Configure system-wide settings and features</p>
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">
            Additional platform admin functionality will be implemented here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PlatformDashboard; 