import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [tipPercentage, setTipPercentage] = useState(15);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const subtotal = 20.47;
  const tax = 1.64;
  const tipAmount = subtotal * (tipPercentage / 100);
  const total = subtotal + tax + tipAmount;
  
  const handlePayment = () => {
    // In a real implementation, this would integrate with Stripe
    setPaymentSuccess(true);
  };
  
  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your order has been paid and is being prepared.</p>
          <p className="text-gray-600 mb-8">Order #: {orderId}</p>
          <Link to={`/order/${orderId}`} className="btn-primary w-full">
            View Order Status
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">Payment</h1>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="divide-y divide-gray-200">
          <div className="py-2 flex justify-between">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="py-2 flex justify-between">
            <p>Tax</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="py-2 flex justify-between">
            <p>Tip ({tipPercentage}%)</p>
            <p>${tipAmount.toFixed(2)}</p>
          </div>
          <div className="py-4 flex justify-between font-semibold">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Tip</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button 
            className={`py-2 px-4 border rounded ${tipPercentage === 0 ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-300'}`}
            onClick={() => setTipPercentage(0)}
          >
            No Tip
          </button>
          <button 
            className={`py-2 px-4 border rounded ${tipPercentage === 10 ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-300'}`}
            onClick={() => setTipPercentage(10)}
          >
            10%
          </button>
          <button 
            className={`py-2 px-4 border rounded ${tipPercentage === 15 ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-300'}`}
            onClick={() => setTipPercentage(15)}
          >
            15%
          </button>
          <button 
            className={`py-2 px-4 border rounded ${tipPercentage === 20 ? 'bg-primary-100 border-primary-500 text-primary-700' : 'border-gray-300'}`}
            onClick={() => setTipPercentage(20)}
          >
            20%
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Custom Tip:</span>
          <input 
            type="number" 
            min="0"
            value={tipPercentage !== 0 && tipPercentage !== 10 && tipPercentage !== 15 && tipPercentage !== 20 ? tipPercentage : ''}
            onChange={(e) => setTipPercentage(parseInt(e.target.value) || 0)}
            className="input w-20 text-right"
            placeholder="%"
          />
          <span className="ml-1">%</span>
        </div>
      </div>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500 text-center">Stripe payment form will be integrated here</p>
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" id="save-card" className="mr-2" />
          <label htmlFor="save-card">Save card for future orders</label>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link to={`/order/${orderId}`} className="btn-outline">
          Back to Order
        </Link>
        <button onClick={handlePayment} className="btn-primary">
          Pay ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 