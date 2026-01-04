import mongoose, { Schema, Types } from 'mongoose'

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: Types.ObjectId, required: true },
    totalAmount: { type: Number, required: true },
    billingDay: { type: Number, required: true },
    totalMembers: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema)
