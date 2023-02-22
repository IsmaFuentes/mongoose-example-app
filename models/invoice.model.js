const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    identificationNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: /^[A-Z0-9\-]{5,}$/,
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    breakdown: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
        },
        description: {
          type: String,
        },
        unitAmount: {
          type: Number,
        },
        quantity: {
          type: Number,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

InvoiceSchema.path('breakdown')
  .schema.virtual('totalAmount')
  .get(function () {
    return this.unitAmount * this.quantity;
  });

module.exports = mongoose.model('Invoice', InvoiceSchema);
