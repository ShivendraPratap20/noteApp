
const mongoose = require('mongoose');


const userOTPSchema = new mongoose.Schema({
  userID: { type: String, required: true, index: true },
  userName: {
    type: String
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (v) {
        return /[a-zA-Z]/.test(v) && /[0-9]/.test(v);
      },
      message: 'Password must be alphanumeric'
    }
  },
  dob: {
    type: Date
  },
  phoneNumber: {
    type: Number,
    validate: {
      validator: function (v) {
        const phoneStr = v.toString();
        return /^\d{10}$/.test(phoneStr);
      },
      message: 'Phone number must be 10 digits long and contain only numbers'
    }
  },
  otp: { type: String, required: true },          
  purpose: { type: String, default: 'signin' },  
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
});

userOTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model('UserOTP', userOTPSchema);

module.exports = otpModel;
