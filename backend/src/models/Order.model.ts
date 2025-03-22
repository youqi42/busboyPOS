import mongoose, { Document, Schema, Model } from 'mongoose';

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Payment status enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Payment method enum
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  MOBILE_PAYMENT = 'mobile_payment',
  HOUSE_ACCOUNT = 'house_account'
}

// Selected modifier interface
export interface ISelectedModifier {
  modifierGroupId: mongoose.Types.ObjectId;
  modifierGroupName: string;
  optionId: mongoose.Types.ObjectId;
  optionName: string;
  price: number;
}

// Order item interface
export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  modifiers: ISelectedModifier[];
  specialInstructions?: string;
  subtotal: number;
  status: OrderStatus;
}

// Payment details interface
export interface IPaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  refundId?: string;
  paidAt?: Date;
  refundedAt?: Date;
}

// Order interface
export interface IOrder extends Document {
  orderNumber: string;
  table: mongoose.Types.ObjectId;
  items: IOrderItem[];
  customer?: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  serviceCharge?: number;
  gratuity?: number;
  total: number;
  payment: IPaymentDetails;
  specialInstructions?: string;
  estimatedReadyTime?: Date;
  completedAt?: Date;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  calculateTotals(): void;
  generateOrderNumber(): void;
}

// Selected modifier schema
const SelectedModifierSchema: Schema = new Schema(
  {
    modifierGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ModifierGroup',
      required: true
    },
    modifierGroupName: {
      type: String,
      required: true
    },
    optionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    optionName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

// Order item schema
const OrderItemSchema: Schema = new Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    modifiers: {
      type: [SelectedModifierSchema],
      default: []
    },
    specialInstructions: {
      type: String
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    }
  },
  { _id: true }
);

// Payment details schema
const PaymentDetailsSchema: Schema = new Schema(
  {
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionId: String,
    stripePaymentIntentId: String,
    stripeClientSecret: String,
    refundId: String,
    paidAt: Date,
    refundedAt: Date
  },
  { _id: false }
);

// Order schema
const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function(v: IOrderItem[]) {
          return v.length > 0;
        },
        message: 'At least one item is required'
      }
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    customerName: {
      type: String
    },
    customerEmail: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    serviceCharge: {
      type: Number,
      min: 0
    },
    gratuity: {
      type: Number,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    payment: {
      type: PaymentDetailsSchema,
      required: true
    },
    specialInstructions: {
      type: String
    },
    estimatedReadyTime: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
OrderSchema.index({ tenantId: 1, createdAt: -1 });
OrderSchema.index({ tenantId: 1, table: 1, status: 1 });
OrderSchema.index({ tenantId: 1, status: 1 });
OrderSchema.index({ tenantId: 1, customer: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });

// Calculate totals before saving
OrderSchema.pre<IOrder>('save', function(next) {
  // Calculate totals if items array has changed or it's a new document
  if (this.isModified('items') || this.isNew) {
    this.calculateTotals();
  }
  
  // Generate order number for new orders
  if (this.isNew) {
    this.generateOrderNumber();
  }
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === OrderStatus.COMPLETED) {
    this.completedAt = new Date();
  }
  
  next();
});

// Method to calculate order totals
OrderSchema.methods.calculateTotals = function() {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum: number, item: IOrderItem) => {
    const itemTotal = item.price * item.quantity;
    const modifiersTotal = item.modifiers.reduce((modSum: number, mod: ISelectedModifier) => modSum + mod.price, 0) * item.quantity;
    return sum + itemTotal + modifiersTotal;
  }, 0);
  
  // Calculate tax (assuming tax rate is stored in restaurant settings)
  // This will need to be updated to fetch actual tax rate from the restaurant
  const taxRate = 0.10; // 10% default tax rate
  this.tax = this.subtotal * taxRate;
  
  // Calculate total
  this.total = this.subtotal + this.tax;
  
  // Add service charge if applicable
  if (this.serviceCharge) {
    this.total += this.serviceCharge;
  }
  
  // Add gratuity if applicable
  if (this.gratuity) {
    this.total += this.gratuity;
  }
  
  // Update payment amount
  if (this.payment) {
    this.payment.amount = this.total;
  }
};

// Generate unique order number
OrderSchema.methods.generateOrderNumber = function() {
  // Get current date in YYYYMMDD format
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);
  
  // Format: YYYYMMDD-XXXX where XXXX is a random number
  this.orderNumber = `${year}${month}${day}-${random}`;
};

// Create model
export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 