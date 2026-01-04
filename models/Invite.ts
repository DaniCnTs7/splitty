import mongoose, { Schema, Types } from 'mongoose'

const InviteSchema = new Schema(
  {
    groupId: { type: Types.ObjectId, required: true },
    email: { type: String },
    token: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    expiresAt: { type: Date },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
)

export const Invite = mongoose.models.Invite || mongoose.model('Invite', InviteSchema)
