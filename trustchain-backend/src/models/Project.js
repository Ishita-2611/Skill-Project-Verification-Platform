import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  githubUrl:   String,

  // Blockchain Data
  projectHash: { type: String, required: true, unique: true },
  ipfsHash:    { type: String, required: true },
  txHash:      String,                // Ethereum tx hash
  blockNumber: Number,

  // Metadata
  skills:      [String],
  fileCount:   Number,
  totalSize:   Number,
  status: {
    type: String,
    enum: ['pending', 'uploaded', 'verified', 'rejected'],
    default: 'pending'
  },
  endorsements: { type: Number, default: 0 },
  verificationCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
