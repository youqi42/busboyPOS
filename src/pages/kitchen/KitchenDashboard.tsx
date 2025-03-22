import React, { useState } from 'react';

// Mock data - in a real application, this would come from Redux/API
const mockOrders = [
  {
    id: 'ORD-001',
    table: 'Table 5',
    status: 'received',
    items: [
      { id: 1, name: 'Cheeseburger', quantity: 1, notes: 'No onions' },
      { id: 2, name: 'Fries (Large)', quantity: 1, notes: '' },
      { id: 3, name: 'Soda', quantity: 1, notes: 'Cola' }
    ],
    createdAt: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
  },
  {
    id: 'ORD-002',
    table: 'Table 3',
    status: 'preparing',
    items: [
      { id: 4, name: 'Caesar Salad', quantity: 1, notes: 'Dressing on the side' },
      { id: 5, name: 'Grilled Salmon', quantity: 2, notes: 'Medium well' },
      { id: 6, name: 'Mashed Potatoes', quantity: 2, notes: '' }
    ],
    createdAt: new Date(Date.now() - 8 * 60000).toISOString() // 8 minutes ago
  },
  {
    id: 'ORD-003',
    table: 'Table 7',
    status: 'ready',
    items: [
      { id: 7, name: 'Chicken Wings', quantity: 1, notes: 'Extra hot sauce' },
      { id: 8, name: 'Onion Rings', quantity: 1, notes: '' }
    ],
    createdAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
  }
];

const KitchenDashboard: React.FC = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'preparing' | 'ready'>('all');
  
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  const updateOrderStatus = (orderId: string, newStatus: 'received' | 'preparing' | 'ready' | 'completed') => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus } 
        : order
    ));
  };
  
  const getTimeElapsed = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    return `${diffMinutes} minutes ago`;
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'received'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => setActiveTab('preparing')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'preparing'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'ready'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ready
              </button>
            </nav>
          </div>
          
          <div className="p-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders in this category</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className={`px-4 py-3 flex justify-between items-center ${
                      order.status === 'received' ? 'bg-yellow-50 border-b border-yellow-100' :
                      order.status === 'preparing' ? 'bg-blue-50 border-b border-blue-100' :
                      'bg-green-50 border-b border-green-100'
                    }`}>
                      <div>
                        <span className="font-semibold">{order.id}</span>
                        <span className="ml-2 text-sm text-gray-600">{order.table}</span>
                      </div>
                      <div className="text-sm text-gray-500">{getTimeElapsed(order.createdAt)}</div>
                    </div>
                    
                    <div className="p-4">
                      <ul className="space-y-2">
                        {order.items.map(item => (
                          <li key={item.id} className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              {item.notes && (
                                <p className="text-sm text-gray-600">Note: {item.notes}</p>
                              )}
                            </div>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 border-t">
                      {order.status === 'received' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="btn-primary w-full"
                        >
                          Start Preparing
                        </button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="btn-primary w-full"
                        >
                          Mark as Ready
                        </button>
                      )}
                      
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="btn-secondary w-full"
                        >
                          Complete Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KitchenDashboard; 