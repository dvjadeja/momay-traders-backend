import { model, Schema } from 'mongoose';

const supplierSchema = new Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    supplierMobileNumber: {
      type: String,
      required: true,
    },
    supplierAddress: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    pendingAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isWhatsappEnabled: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

supplierSchema.index({
  supplierName: 'text',
  supplierMobileNumber: 'text',
  supplierAddress: 'text',
});

supplierSchema.index({ organization: 1 });
supplierSchema.index({ createdAt: -1 });
supplierSchema.index({ isArchived: 1 });

const SupplierModel = model('Supplier', supplierSchema);

export default SupplierModel;
