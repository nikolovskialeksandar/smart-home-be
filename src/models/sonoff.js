import mongoose from 'mongoose';

const sonoffSchema = new mongoose.Schema({
  switch: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Sonoff = mongoose.model('Sonoff', sonoffSchema);

export default Sonoff;
