import { Document, Model, model, models, Schema, Types } from 'mongoose'

export interface IGroupMember extends Document {
  groupId: Types.ObjectId
  userId: Types.ObjectId
  role: string
  status: string
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['OWNER', 'MEMBER'],
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'LEFT', 'REMOVED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
)

export const GroupMember: Model<IGroupMember> =
  models.GroupMember || model<IGroupMember>('GroupMember', GroupMemberSchema)
