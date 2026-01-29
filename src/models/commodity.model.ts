import { model, Schema } from 'mongoose';

const commoditySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
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

const CommodityModel = model('Commodity', commoditySchema);

commoditySchema.index({ name: 1 });

export default CommodityModel;
