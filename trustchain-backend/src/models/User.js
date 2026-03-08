import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, trim: true
  },
  email: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true
  },
  password: { type: String, required: true, minlength: 8 },
  walletAddress: { type: String, unique: true, sparse: true },
  role: {
    type: String,
    enum: ['developer', 'recruiter', 'reviewer'],
    default: 'developer'
  },
  reputationScore: { type: Number, default: 0 },
  skills: [String],
  githubUrl: String,
  bio: String,
  avatar: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
