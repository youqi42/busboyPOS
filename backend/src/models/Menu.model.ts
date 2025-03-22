import mongoose, { Document, Schema, Model } from 'mongoose';

// Modifier option interface
export interface IModifierOption extends Document {
  name: string;
  price: number;
  isDefault?: boolean;
}

// Modifier group interface
export interface IModifierGroup extends Document {
  name: string;
  required: boolean;
  multiple: boolean;
  min?: number;
  max?: number;
  options: IModifierOption[];
}

// Menu item interface
export interface IMenuItem extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: mongoose.Types.ObjectId;
  modifierGroups: mongoose.Types.ObjectId[];
  allergens?: string[];
  dietary?: string[];
  calories?: number;
  prepTime?: number; // in minutes
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Menu category interface
export interface IMenuCategory extends Document {
  name: string;
  description?: string;
  image?: string;
  isAvailable: boolean;
  sortOrder: number;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Modifier option schema
const ModifierOptionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

// Modifier group schema
const ModifierGroupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    required: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      min: 0,
      default: 0
    },
    max: {
      type: Number,
      min: 1,
      validate: {
        validator: function(this: any, v: number) {
          return !this.multiple || v >= this.min;
        },
        message: 'Max selections must be greater than or equal to min selections'
      }
    },
    options: {
      type: [ModifierOptionSchema],
      required: [true, 'Please add at least one option'],
      validate: {
        validator: function(v: IModifierOption[]) {
          return v.length > 0;
        },
        message: 'At least one option is required'
      }
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

// Menu category schema
const MenuCategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
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

// Menu item schema
const MenuItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0
    },
    image: {
      type: String
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: [true, 'Please add a category']
    },
    modifierGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModifierGroup'
      }
    ],
    allergens: {
      type: [String],
      enum: [
        'gluten',
        'crustaceans',
        'eggs',
        'fish',
        'peanuts',
        'soybeans',
        'milk',
        'nuts',
        'celery',
        'mustard',
        'sesame',
        'sulphites',
        'lupin',
        'molluscs'
      ]
    },
    dietary: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'dairy-free']
    },
    calories: {
      type: Number,
      min: 0
    },
    prepTime: {
      type: Number,
      min: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
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
MenuCategorySchema.index({ tenantId: 1, sortOrder: 1 });
MenuItemSchema.index({ tenantId: 1, category: 1, sortOrder: 1 });
MenuItemSchema.index({ tenantId: 1, isAvailable: 1 });
MenuItemSchema.index({ tenantId: 1, isFeatured: 1 });
ModifierGroupSchema.index({ tenantId: 1 });

// Create models
export const ModifierGroup: Model<IModifierGroup> = mongoose.model<IModifierGroup>(
  'ModifierGroup',
  ModifierGroupSchema
);

export const MenuCategory: Model<IMenuCategory> = mongoose.model<IMenuCategory>(
  'MenuCategory',
  MenuCategorySchema
);

export const MenuItem: Model<IMenuItem> = mongoose.model<IMenuItem>(
  'MenuItem',
  MenuItemSchema
);

export default {
  ModifierGroup,
  MenuCategory,
  MenuItem
}; 