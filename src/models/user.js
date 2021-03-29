import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 8) {
        throw new Error('Password too short');
      }
    },
  },
});

const User = mongoose.model('User', userSchema);

export default User;
