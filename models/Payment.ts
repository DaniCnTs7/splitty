import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPayment extends Document {
  userId: Types.ObjectId
  groupId: Types.ObjectId
  stripeCustomerId: string
  stripePaymentMethodId: string
  role: 'owner' | 'member'
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    stripeCustomerId: { type: String, required: true },
    stripePaymentMethodId: { type: String, required: true },
    role: { type: String, enum: ['owner', 'member'], required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
