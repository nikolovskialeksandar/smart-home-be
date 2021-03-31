import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
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
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

// Link owned sonoff devices

userSchema.virtual('sonoffDevices', {
  ref: 'Sonoff',
  localField: '_id',
  foreignField: 'owner',
});

// Generate token

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens.push({ token });
  await user.save();
  return token;
};

// Log in user

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash password before saving

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Get public user profile

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
