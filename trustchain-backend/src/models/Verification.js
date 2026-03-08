import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  skills: [String],
  endorsedBy: { type: Number, default: 0 },
  txHash: String, // Blockchain transaction hash
  blockNumber: Number
}, { timestamps: true });

export default mongoose.model('Verification', verificationSchema);
