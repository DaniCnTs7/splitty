import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IInvite extends Document {
  groupId: Types.ObjectId
  email: string
  token: string
  amount: number
  expiresAt: Date
  acceptedAt: Date
}

const InviteSchema = new Schema<IInvite>(
  {
    groupId: { type: Schema.Types.ObjectId, required: true },
    email: { type: String },
    token: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    expiresAt: { type: Date },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
)

export const Invite: Model<IInvite> =
  mongoose.models.Invite || mongoose.model<IInvite>('Invite', InviteSchema)
