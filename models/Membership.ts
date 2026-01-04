import mongoose, { Schema, Types } from 'mongoose'

const MembershipSchema = new Schema(
  {
    groupId: { type: Types.ObjectId, required: true },
    userId: { type: Types.ObjectId, required: true },
    role: { type: String, enum: ['OWNER', 'MEMBER'], required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'past_due', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export const Membership =
  mongoose.models.Membership || mongoose.model('Membership', MembershipSchema)
