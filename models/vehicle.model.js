const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      trim: true,
      required: true,
    },
    carplate: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
      unique: true,
    },
    revisions: [
      {
        date: {
          type: Date,
          default: new Date(),
        },
        kilometers: {
          type: Number,
          required: true,
        },
        employee: {
          type: mongoose.Types.ObjectId,
          ref: 'Employee',
          required: true,
        },
        observations: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
