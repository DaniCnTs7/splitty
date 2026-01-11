import { Document, Model, model, models, Schema, Types } from 'mongoose'

export interface IPaymentCycle extends Document {
  groupId: Types.ObjectId
  cycleDate: Date
  totalAmount: number
  totalWithFees: number
  memberAmount: number
  status: string
}

const PaymentCycleSchema = new Schema<IPaymentCycle>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    cycleDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalWithFees: {
      type: Number,
      required: true,
    },
    memberAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'MEMBERS_CHARGING',
        'MEMBERS_CHARGED',
        'OWNER_PAID',
        'COMPLETED',
        'FAILED',
      ],
      default: 'PENDING',
    },
  },
  { timestamps: true }
)

export const PaymentCycle: Model<IPaymentCycle> =
  models.PaymentCycle || model<IPaymentCycle>('PaymentCycle', PaymentCycleSchema)
