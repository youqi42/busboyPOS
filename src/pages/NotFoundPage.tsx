import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. The page might have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-block py-3 px-8"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 