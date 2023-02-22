const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    surnames: {
      type: String,
      trim: true,
      required: true,
    },
    identificationNumber: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
      unique: true,
    },
    birthdate: {
      type: Date,
      required: true,
      validate: [
        function (birthdate) {
          return new Date(birthdate).getTime() < new Date().getTime();
        },
        'Invalid birthdate',
      ],
    },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.pre('findOneAndDelete', function (next) {
  const { _id } = this._conditions;
  const count = mongoose.model('Vehicle').countDocuments({ 'revisions.employee': _id });
  if (count > 0) {
    throw new Error('Algunos vehículos dependen del empleado');
  }
  next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);
