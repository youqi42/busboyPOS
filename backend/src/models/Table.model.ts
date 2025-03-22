import mongoose, { Document, Schema, Model } from 'mongoose';
import crypto from 'crypto';

// Table status enum
export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance'
}

// Table zone interface for organizing tables
export interface ITableZone {
  name: string;
  color?: string;
}

// Table interface
export interface ITable extends Document {
  name: string;
  number: number;
  capacity: number;
  zone?: string;
  status: TableStatus;
  qrCode: string;
  qrCodeUrl?: string;
  lastOccupiedAt?: Date;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  generateQRCode(): void;
}

// Table zone schema
const TableZoneSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a zone name'],
      trim: true
    },
    color: {
      type: String,
      default: '#3B82F6' // Default blue color
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Please add a tenant ID']
    }
  },
  {
    timestamps: true
  }
);

// Table schema
const TableSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a table name'],
      trim: true
    },
    number: {
      type: Number,
      required: [true, 'Please add a table number'],
      min: 1
    },
    capacity: {
      type: Number,
      required: [true, 'Please add a table capacity'],
      min: 1
    },
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TableZone'
    },
    status: {
      type: String,
      enum: Object.values(TableStatus),
      default: TableStatus.AVAILABLE
    },
    qrCode: {
      type: String,
      required: [true, 'QR code is required'],
      unique: true
    },
    qrCodeUrl: {
      type: String
    },
    lastOccupiedAt: {
      type: Date
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Please add a tenant ID']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
TableSchema.index({ tenantId: 1, number: 1 }, { unique: true });
TableSchema.index({ tenantId: 1, status: 1 });
TableZoneSchema.index({ tenantId: 1, name: 1 }, { unique: true });

// Generate QR code before saving
TableSchema.pre<ITable>('save', function(next) {
  // Generate QR code only if it doesn't exist or if table number changed
  if (!this.qrCode || this.isModified('number')) {
    this.generateQRCode();
  }
  
  next();
});

// Method to generate a unique QR code for the table
TableSchema.methods.generateQRCode = function() {
  // Create a hash using table ID, tenant ID and a timestamp
  const hash = crypto
    .createHash('sha256')
    .update(`${this.tenantId}-${this.number}-${Date.now()}`)
    .digest('hex')
    .substring(0, 12);
    
  // Set the QR code (will be used to generate a QR code image)
  this.qrCode = hash;
};

// Create models
export const TableZone: Model<ITableZone> = mongoose.model<ITableZone>(
  'TableZone',
  TableZoneSchema
);

export const Table: Model<ITable> = mongoose.model<ITable>(
  'Table',
  TableSchema
);

export default {
  Table,
  TableZone
}; 