import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadProject,
  getMyProjects,
  getProjectById,
  updateProjectStatus,
  deleteProject,
  getProjectStats
} from '../controllers/project.controller.js';

const router = Router();

router.post('/upload', protect, upload.single('file'), uploadProject);
router.get('/my', protect, getMyProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProjectById);
router.put('/:id/status', protect, authorize('reviewer', 'recruiter'), updateProjectStatus);
router.delete('/:id', protect, deleteProject);

export default router;
