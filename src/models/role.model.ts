import { model, Schema } from 'mongoose';

const permission = {
  type: Schema.Types.ObjectId,
  ref: 'Permission',
};

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    permissions: {
      type: [permission],
      default: [],
    },
  },
  { timestamps: true },
);

const RoleModel = model('Role', roleSchema);

export default RoleModel;
