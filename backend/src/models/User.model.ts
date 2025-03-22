import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '../middlewares/auth.middleware';

// User document interface
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId?: mongoose.Types.ObjectId;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

// User schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password in queries by default
    },
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'Please specify user role']
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: function(this: any) {
        // tenantId is required for all roles except platform admin
        return this.role !== UserRole.PLATFORM_ADMIN;
      }
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
);

// Index for better query performance
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });

// Encrypt password using bcrypt before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(): string {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      tenantId: this.tenantId
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION || '1d'
    }
  );
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // Set expire time
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User; 