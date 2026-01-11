import { Document, Model, Schema, model, models } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  stripeCustomerId: string
  defaultPaymentMethodId: string
  payoutPaymentMethodId: string
  role: string
}

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String },
    defaultPaymentMethodId: { type: String },
    payoutPaymentMethodId: { type: String },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
)

export const User: Model<IUser> = models.User || model<IUser>('User', UserSchema)
