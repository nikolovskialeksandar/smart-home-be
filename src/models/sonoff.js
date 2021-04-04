import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const sonoffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    required: true,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Generate token

sonoffSchema.methods.generateAuthToken = async function () {
  const sonoff = this;
  const token = await jwt.sign({ _id: sonoff._id }, process.env.JWT_SECRET);
  sonoff.token = token;
  await sonoff.save();
  return token;
};

// Get public device profile

sonoffSchema.methods.toJSON = function () {
  const sonoff = this;
  const sonoffObject = sonoff.toObject();
  delete sonoffObject.token;
  return sonoffObject;
};

const Sonoff = mongoose.model('Sonoff', sonoffSchema);

export default Sonoff;
