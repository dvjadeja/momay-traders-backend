import { model, Schema } from 'mongoose';

const buyerSchema = new Schema(
  {
    buyerName: {
      type: String,
      required: true,
    },
    buyerMobileNumber: {
      type: String,
      required: true,
    },
    buyerAddress: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      default: null,
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

const BuyerModel = model('Buyer', buyerSchema);

buyerSchema.index({
  buyerName: 'text',
  buyerMobileNumber: 'text',
  buyerAddress: 'text',
  buyerEmail: 'text',
});

buyerSchema.index({ organization: 1 });
buyerSchema.index({ createdAt: -1 });
buyerSchema.index({ isArchived: 1 });

export default BuyerModel;
