import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

const Sonoff = mongoose.model('Sonoff', sonoffSchema);

export default Sonoff;
