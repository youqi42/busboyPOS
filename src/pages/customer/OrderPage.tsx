import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order #{orderId}</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex items-center mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full w-2/4"></div>
          </div>
        </div>
        <div className="grid grid-cols-4 text-center">
          <div className="text-sm">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
            <p className="font-medium">Received</p>
          </div>
          <div className="text-sm">
            <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
            <p className="font-medium">Preparing</p>
          </div>
          <div className="text-sm">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">3</div>
            <p className="text-gray-500">Ready</p>
          </div>
          <div className="text-sm">
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">4</div>
            <p className="text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="divide-y divide-gray-200">
          <div className="py-4 flex justify-between">
            <div>
              <p className="font-medium">Cheeseburger</p>
              <p className="text-sm text-gray-600">Special: No onions</p>
            </div>
            <div className="text-right">
              <p>$12.99</p>
              <p className="text-sm text-gray-600">x1</p>
            </div>
          </div>
          <div className="py-4 flex justify-between">
            <div>
              <p className="font-medium">Fries (Large)</p>
            </div>
            <div className="text-right">
              <p>$4.99</p>
              <p className="text-sm text-gray-600">x1</p>
            </div>
          </div>
          <div className="py-4 flex justify-between">
            <div>
              <p className="font-medium">Soda</p>
              <p className="text-sm text-gray-600">Cola</p>
            </div>
            <div className="text-right">
              <p>$2.49</p>
              <p className="text-sm text-gray-600">x1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
        <div className="divide-y divide-gray-200">
          <div className="py-2 flex justify-between">
            <p>Subtotal</p>
            <p>$20.47</p>
          </div>
          <div className="py-2 flex justify-between">
            <p>Tax</p>
            <p>$1.64</p>
          </div>
          <div className="py-2 flex justify-between">
            <p>Tip</p>
            <p>$3.00</p>
          </div>
          <div className="py-4 flex justify-between font-semibold">
            <p>Total</p>
            <p>$25.11</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link to={`/menu/123`} className="btn-outline">
          Back to Menu
        </Link>
        <Link to={`/payment/${orderId}`} className="btn-primary">
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
};

export default OrderPage; 