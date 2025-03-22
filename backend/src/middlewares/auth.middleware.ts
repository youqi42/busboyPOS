import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import mongoose from 'mongoose';

// Extend the Express Request type to include user object
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      tenantId?: string;
    };
  }
}

// User roles
export enum UserRole {
  CUSTOMER = 'customer',
  KITCHEN_STAFF = 'kitchen_staff',
  RESTAURANT_ADMIN = 'restaurant_admin',
  PLATFORM_ADMIN = 'platform_admin'
}

// Middleware to protect routes by verifying JWT token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    
    // If no token is found, return error
    if (!token) {
      next(new AppError('Not authorized to access this route', 401));
      return;
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as {
        id: string;
        email: string;
        role: string;
        tenantId?: string;
      };
      
      // Set user in request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        tenantId: decoded.tenantId
      };
      
      next();
    } catch (error) {
      next(new AppError('Token is invalid or expired', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to restrict access based on user roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('User not found in request', 401));
      return;
    }
    
    if (!roles.includes(req.user.role as UserRole)) {
      next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
      return;
    }
    
    next();
  };
};

// Middleware to check if user belongs to the specified tenant
export const checkTenantAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      next(new AppError('User not found in request', 401));
      return;
    }
    
    // Platform admins can access any tenant
    if (req.user.role === UserRole.PLATFORM_ADMIN) {
      next();
      return;
    }
    
    const requestedTenantId = req.params.tenantId || req.body.tenantId;
    
    // If no tenantId specified in request, proceed
    if (!requestedTenantId) {
      next();
      return;
    }
    
    // Check if user belongs to the requested tenant
    if (req.user.tenantId !== requestedTenantId) {
      next(new AppError('Not authorized to access this tenant data', 403));
      return;
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 