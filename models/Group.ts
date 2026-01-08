import mongoose, { Schema, Types } from 'mongoose'

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Types.ObjectId, required: true, ref: 'User' },
    totalAmount: { type: Number, required: true },
    billingDay: { type: Number, required: true },
    totalMembers: { type: Number, required: true },
    stripeConnectAccountId: { type: String, required: true },
    members: [{ type: Types.ObjectId, ref: 'Membership' }],
  },
  { timestamps: true }
)

export const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema)
