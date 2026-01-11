import { Document, Model, model, models, Schema, Types } from 'mongoose'

export interface IMemberPayment extends Document {
  paymentCycleId: Types.ObjectId
  userId: Types.ObjectId
  amount: number
  stripePaymentIntentId: string
  status: string
  failureReason?: string
}

const MemberPaymentSchema = new Schema<IMemberPayment>(
  {
    paymentCycleId: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentCycle',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    failureReason: String,
  },
  { timestamps: true }
)

export const MemberPayment: Model<IMemberPayment> =
  models.MemberPayment || model<IMemberPayment>('MemberPayment', MemberPaymentSchema)
