import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard stats and recent orders
  const stats = [
    { label: 'Total Orders', value: '127', change: '+12.5%', trend: 'up' },
    { label: 'Revenue', value: '$4,385.00', change: '+8.2%', trend: 'up' },
    { label: 'Avg. Order Value', value: '$34.52', change: '-2.3%', trend: 'down' },
    { label: 'Active Tables', value: '8/12', change: '', trend: 'neutral' },
  ];
  
  const recentOrders = [
    { id: 'ORD-127', table: 'Table 5', items: 3, total: '$42.50', status: 'Completed', time: '10 min ago' },
    { id: 'ORD-126', table: 'Table 3', items: 5, total: '$78.20', status: 'Ready', time: '25 min ago' },
    { id: 'ORD-125', table: 'Table 7', items: 2, total: '$24.99', status: 'Preparing', time: '35 min ago' },
    { id: 'ORD-124', table: 'Table 2', items: 4, total: '$56.75', status: 'Completed', time: '1 hour ago' },
  ];
  
  const popularItems = [
    { name: 'Cheeseburger', orders: 45, revenue: '$584.55' },
    { name: 'Caesar Salad', orders: 38, revenue: '$455.62' },
    { name: 'Fries (Large)', orders: 36, revenue: '$179.64' },
    { name: 'Grilled Salmon', orders: 28, revenue: '$559.72' },
    { name: 'Chocolate Cake', orders: 24, revenue: '$167.76' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <div className="space-x-2">
            <Link to="/admin/settings" className="btn-outline">Settings</Link>
            <button className="btn-primary">+ New Order</button>
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
                  {stat.change} from last week
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent orders section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-500">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.table}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Popular items section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Popular Items</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {popularItems.map((item, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.orders} orders</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{item.revenue}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick access section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/menu" className="block bg-white p-6 rounded-lg shadow border-l-4 border-primary-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Menu Management</h3>
            <p className="mt-1 text-sm text-gray-500">Edit menu items, categories, and pricing</p>
          </Link>
          <Link to="/admin/staff" className="block bg-white p-6 rounded-lg shadow border-l-4 border-secondary-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
            <p className="mt-1 text-sm text-gray-500">Manage staff accounts and permissions</p>
          </Link>
          <Link to="/admin/settings" className="block bg-white p-6 rounded-lg shadow border-l-4 border-gray-500 hover:bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Restaurant Settings</h3>
            <p className="mt-1 text-sm text-gray-500">Configure hours, tables, and preferences</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 