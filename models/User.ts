import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    stripeCustomerId: String,
    stripeConnectAccountId: String,
    canReceivePayments: { type: Boolean, default: false },
    hasPaymentMethod: { type: Boolean, default: false },
    defaultPaymentMethod: String,
    paymentMethodId: String,
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', UserSchema)
