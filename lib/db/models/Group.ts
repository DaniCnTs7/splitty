import { model, models, Schema, Document, Model, Types } from 'mongoose'

export interface IGroup extends Document {
  name: string
  ownerId: Types.ObjectId
  totalAmount: number
  billingDay: number
  maxMembers: number
  status: string
  appFeePercent: number
}

const GroupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    billingDay: {
      type: Number,
      required: true,
    },
    maxMembers: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['WAITING_FOR_MEMBERS', 'ACTIVE', 'PAUSED', 'CANCELLED'],
      default: 'WAITING_FOR_MEMBERS',
    },
    appFeePercent: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
)

export const Group: Model<IGroup> = models.Group || model<IGroup>('Group', GroupSchema)
