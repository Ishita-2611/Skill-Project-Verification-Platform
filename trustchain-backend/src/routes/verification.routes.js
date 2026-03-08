import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  submitVerification,
  getProjectVerifications,
  verifyHashOnChain,
  getReviewerStats,
  getVerificationStats,
  getAvailableProjects
} from '../controllers/verification.controller.js';

const router = Router();

// list projects that the logged-in reviewer can verify
router.get('/available', protect, authorize('reviewer', 'recruiter'), getAvailableProjects);

router.post('/:projectId', protect, authorize('reviewer', 'recruiter'), submitVerification);
router.get('/:projectId', getProjectVerifications);
router.get('/hash/:hash', verifyHashOnChain);
router.get('/stats/reviewer', protect, getReviewerStats);
router.get('/stats/all', getVerificationStats);

export default router;
