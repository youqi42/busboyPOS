import { Request, Response, NextFunction } from 'express';

// Define the error interface
export interface IAppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  path?: string;
  value?: string;
  code?: number;
  keyValue?: Record<string, any>;
}

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: IAppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue as Record<string, any>)[0];
    res.status(400).json({
      success: false,
      message: `Duplicate value: ${field} already exists`,
      error: 'DuplicateKeyError'
    });
    return;
  }
  
  // MongoDB validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: message,
      error: 'ValidationError'
    });
    return;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'AuthenticationError'
    });
    return;
  }
  
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'AuthenticationError'
    });
    return;
  }
  
  // Default error response
  res.status(statusCode).json({
    success: false,
    message,
    error: err.name,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (server: any): void => {
  process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    
    server.close(() => {
      process.exit(1);
    });
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on('uncaughtException', (err: Error) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    
    process.exit(1);
  });
}; 