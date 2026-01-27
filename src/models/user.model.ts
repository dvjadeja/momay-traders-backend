import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const UserModel = model('User', userSchema);

export default UserModel;
