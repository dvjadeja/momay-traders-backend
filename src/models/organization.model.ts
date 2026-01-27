import { model, Schema } from 'mongoose';

const subscriptionHistorySchema = {
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
};

const organizationSchema = new Schema(
  {
    // Company Details
    name: {
      type: String,
      required: true,
      unique: true,
    },
    companyLogo: String,
    companyAddress: String,
    email: {
      type: String,
      required: true,
    },
    website: String,
    mobileNumber: {
      type: String,
      required: true,
    },

    // Bank Details
    bankName: String,
    bankBranchName: String,
    bankIfsc: String,
    bankAccountNumber: String,
    bankAccountHolderName: String,
    signatureStamp: String,

    // GST Details
    gstNumber: String,
    panNumber: String,

    // Trail
    isTrailActive: {
      type: Boolean,
      default: true,
    },
    isTrialExpired: {
      type: Boolean,
      default: false,
    },
    trialStartDate: {
      type: Date,
      default: new Date().toISOString(),
    },
    trialEndDate: {
      type: Date,
      default: new Date().toISOString(),
    },

    // Subscription Details
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
      default: 'INACTIVE',
    },
    subscriptionHistory: {
      type: [subscriptionHistorySchema],
      default: [],
    },

    // Stats
    creditAvailable: {
      type: Number,
      default: 0,
    },
    totalPurchaseAmount: {
      type: Number,
      default: 0,
    },
    totalSaleAmount: {
      type: Number,
      default: 0,
    },
    totalProfit: {
      type: Number,
      default: 0,
    },
    totalTurnOver: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const OrganizationModel = model('Organization', organizationSchema);

export default OrganizationModel;
