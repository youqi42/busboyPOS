import mongoose, { Document, Schema, Model } from 'mongoose';

// Address interface
export interface IAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Business hours interface
export interface IBusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

// Restaurant settings interface
export interface IRestaurantSettings {
  taxRate: number;
  currency: string;
  serviceCharge?: number;
  gratuityPercentage?: number;
  autoGratuityCount?: number; // Auto add gratuity for parties larger than this
  allowSplitBills: boolean;
  requireCheckout: boolean; // Require staff approval for checkout
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  favicon?: string;
}

// Restaurant subscription interface
export interface ISubscription {
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  trialEnds?: Date;
  currentPeriodEnd: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

// Restaurant document interface
export interface IRestaurant extends Document {
  name: string;
  slug: string;
  description?: string;
  address: IAddress;
  phoneNumber: string;
  email: string;
  website?: string;
  timezone: string;
  businessHours: IBusinessHours[];
  settings: IRestaurantSettings;
  subscription: ISubscription;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Address schema
const AddressSchema: Schema = new Schema(
  {
    street: {
      type: String,
      required: [true, 'Please add a street address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Please add a postal code'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      trim: true
    }
  },
  { _id: false }
);

// Business hours schema
const BusinessHoursSchema: Schema = new Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    open: {
      type: String,
      required: function(this: any) {
        return !this.isClosed;
      },
      validate: {
        validator: function(v: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // HH:MM format
        },
        message: 'Open time must be in HH:MM format'
      }
    },
    close: {
      type: String,
      required: function(this: any) {
        return !this.isClosed;
      },
      validate: {
        validator: function(v: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // HH:MM format
        },
        message: 'Close time must be in HH:MM format'
      }
    },
    isClosed: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

// Restaurant settings schema
const RestaurantSettingsSchema: Schema = new Schema(
  {
    taxRate: {
      type: Number,
      required: [true, 'Please add a tax rate'],
      min: 0,
      max: 100,
      default: 0
    },
    currency: {
      type: String,
      required: [true, 'Please add a currency'],
      default: 'USD'
    },
    serviceCharge: {
      type: Number,
      min: 0,
      max: 100
    },
    gratuityPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    autoGratuityCount: {
      type: Number,
      min: 1
    },
    allowSplitBills: {
      type: Boolean,
      default: true
    },
    requireCheckout: {
      type: Boolean,
      default: false
    },
    primaryColor: String,
    secondaryColor: String,
    logo: String,
    favicon: String
  },
  { _id: false }
);

// Subscription schema
const SubscriptionSchema: Schema = new Schema(
  {
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trial'],
      default: 'active'
    },
    trialEnds: Date,
    currentPeriodEnd: {
      type: Date,
      required: true,
      default: function() {
        // Default to 1 month from now
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  { _id: false }
);

// Restaurant schema
const RestaurantSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    address: {
      type: AddressSchema,
      required: [true, 'Please add an address']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    website: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      required: [true, 'Please add a timezone'],
      default: 'UTC'
    },
    businessHours: {
      type: [BusinessHoursSchema],
      default: [
        { day: 'monday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'tuesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'wednesday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'thursday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'friday', open: '09:00', close: '17:00', isClosed: false },
        { day: 'saturday', open: '10:00', close: '16:00', isClosed: false },
        { day: 'sunday', open: '00:00', close: '00:00', isClosed: true }
      ]
    },
    settings: {
      type: RestaurantSettingsSchema,
      default: {
        taxRate: 0,
        currency: 'USD',
        allowSplitBills: true,
        requireCheckout: false
      }
    },
    subscription: {
      type: SubscriptionSchema,
      default: {
        plan: 'free',
        status: 'active'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Generate slug from restaurant name
RestaurantSchema.pre<IRestaurant>('save', async function(next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  
  try {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const slugExists = await mongoose.model('Restaurant').findOne({
      slug: this.slug,
      _id: { $ne: this._id }
    });
    
    // If slug exists, append a random string
    if (slugExists) {
      const randomString = Math.random().toString(36).substring(2, 7);
      this.slug = `${this.slug}-${randomString}`;
    }
    
    next();
  } catch (error: any) {
    next(error);
  }
});

// Create model
export const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>(
  'Restaurant',
  RestaurantSchema
);

export default Restaurant; 