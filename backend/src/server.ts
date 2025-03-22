import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import middleware
import { errorHandler } from './middlewares/errorHandler';

// Import routes (to be created later)
// import authRoutes from './routes/auth.routes';
// import restaurantRoutes from './routes/restaurant.routes';
// import menuRoutes from './routes/menu.routes';
// import orderRoutes from './routes/order.routes';
// import tableRoutes from './routes/table.routes';
// import userRoutes from './routes/user.routes';
// import analyticsRoutes from './routes/analytics.routes';

// Initialize Express app
const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://busboypos.com', 'https://app.busboypos.com'] 
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Set up database connection
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Set up middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Set up static files directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Set up API version prefix
const API_VERSION = process.env.API_VERSION || 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// API health check
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to busboyPOS API', version: API_VERSION });
});

// Set up routes (to be uncommented when routes are created)
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/restaurants`, restaurantRoutes);
// app.use(`${API_PREFIX}/menu`, menuRoutes);
// app.use(`${API_PREFIX}/orders`, orderRoutes);
// app.use(`${API_PREFIX}/tables`, tableRoutes);
// app.use(`${API_PREFIX}/users`, userRoutes);
// app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

// Set up socket.io event handlers
// This will be moved to a separate module later
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Export for testing
export { app, httpServer, io }; 