// /models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Not required for OAuth users
    },
    image: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      required: false,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Remove the duplicate index since unique: true already creates one
// userSchema.index({ email: 1 }) // Remove this line

// Export the model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
