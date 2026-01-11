import { Document, Model, model, models, Schema, Types } from 'mongoose'

export interface IOwnerPayout extends Document {
  paymentCycleId: Types.ObjectId
  ownerId: Types.ObjectId
  amount: number
  stripePayoutId: string
  status: string
  failureReason: string
}

const OwnerPayoutSchema = new Schema<IOwnerPayout>(
  {
    paymentCycleId: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentCycle',
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stripePayoutId: {
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

export const OwnerPayout: Model<IOwnerPayout> =
  models.OwnerPayout || model<IOwnerPayout>('OwnerPayout', OwnerPayoutSchema)
