import { model, Schema } from 'mongoose';

const permissionSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const PermissionModel = model('Permission', permissionSchema);

export default PermissionModel;
