import Verification from '../models/Verification.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { verifyHash } from '../services/blockchain.service.js';

export const submitVerification = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { rating, comment, skills } = req.body;

    // Check if reviewer is a reviewer
    if (req.user.role !== 'reviewer' && req.user.role !== 'recruiter') {
      return res.status(403).json({ error: 'Only reviewers can verify projects' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if reviewer already verified this project
    const existingVerification = await Verification.findOne({
      projectId,
      reviewerId: req.user._id
    });

    if (existingVerification) {
      return res.status(409).json({ error: 'You have already verified this project' });
    }

    // Create verification record
    const verification = await Verification.create({
      projectId,
      reviewerId: req.user._id,
      status: 'approved',
      rating: rating || 5,
      comment,
      skills: skills || []
    });

    // Update project verification count
    await Project.findByIdAndUpdate(
      projectId,
      { 
        $inc: { verificationCount: 1 },
        status: 'verified'
      }
    );

    res.status(201).json({
      success: true,
      message: 'Project verified successfully',
      verification
    });

  } catch (err) { next(err); }
};

export const getProjectVerifications = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const verifications = await Verification.find({ projectId })
      .populate('reviewerId', 'username email avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: verifications.length,
      verifications
    });
  } catch (err) { next(err); }
};

export const verifyHashOnChain = async (req, res, next) => {
  try {
    const { hash } = req.params;
    const { userAddress } = req.query;

    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress query parameter required' });
    }

    try {
      const isValid = await verifyHash(userAddress, hash);
      res.json({
        success: true,
        hash,
        userAddress,
        isValid
      });
    } catch (err) {
      // If blockchain is not available, check in database
      console.warn('⚠️ Blockchain verification failed, checking database...');
      const project = await Project.findOne({ projectHash: hash });
      
      res.json({
        success: true,
        hash,
        userAddress,
        isValid: !!project,
        source: 'database'
      });
    }
  } catch (err) { next(err); }
};

export const getReviewerStats = async (req, res, next) => {
  try {
    const reviewerId = req.user._id;
    
    const totalVerifications = await Verification.countDocuments({ reviewerId });
    const approvedVerifications = await Verification.countDocuments({ 
      reviewerId, 
      status: 'approved' 
    });
    const avgRating = await Verification.aggregate([
      { $match: { reviewerId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalVerifications,
        approvedVerifications,
        avgRating: avgRating[0]?.avgRating || 0
      }
    });
  } catch (err) { next(err); }
};

export const getVerificationStats = async (req, res, next) => {
  try {
    const totalVerifications = await Verification.countDocuments();
    const approvedVerifications = await Verification.countDocuments({ status: 'approved' });
    const averageRating = await Verification.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalVerifications,
        approvedVerifications,
        averageRating: averageRating[0]?.avgRating || 0,
        approvalRate: totalVerifications > 0 ? 
          (approvedVerifications / totalVerifications * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (err) { next(err); }
};

// ── Projects available for the current authenticated reviewer ──
export const getAvailableProjects = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // find ids of projects the user already reviewed
    const reviewed = await Verification.find({ reviewerId: userId }).distinct('projectId');

    const projects = await Project.find({
      status: 'uploaded',                  // only successfully uploaded projects
      userId: { $ne: userId },             // not the user's own project
      _id: { $nin: reviewed }              // not already reviewed by this user
    }).populate('userId', 'username avatar');

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (err) {
    next(err);
  }
};
