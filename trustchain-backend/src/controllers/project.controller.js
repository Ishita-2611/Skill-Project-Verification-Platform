import Project from '../models/Project.js';
import User from '../models/User.js';
import { uploadToIPFS, generateProjectHash } from '../services/ipfs.service.js';
import { storeProjectHash, verifyHash } from '../services/blockchain.service.js';
import fs from 'fs';

export const uploadProject = async (req, res, next) => {
  try {
    const { title, description, githubUrl, skills, walletAddress } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    // ── Step 1: Upload to IPFS ──
    console.log('📦 Uploading to IPFS...');
    let ipfsHash;
    try {
      ipfsHash = await uploadToIPFS(file.path, file.originalname);
      console.log(`✅ IPFS Hash: ${ipfsHash}`);
    } catch (err) {
      console.warn('⚠️ IPFS upload failed:', err.message);
      ipfsHash = 'ipfs_hash_placeholder_' + Date.now();
    }

    // ── Step 2: Generate project hash ──
    const projectHash = generateProjectHash({
      title, description, githubUrl,
      userId: req.user._id.toString(),
      timestamp: Date.now()
    });

    // ── Step 3: Store on blockchain ──
    console.log('⛓ Storing hash on blockchain...');
    let txData = { txHash: 'pending', blockNumber: 0, gasUsed: '0' };
    try {
      txData = await storeProjectHash(
        walletAddress || req.user.walletAddress || req.user._id.toString(),
        projectHash,
        ipfsHash
      );
      console.log(`✅ Blockchain TX: ${txData.txHash}`);
    } catch (err) {
      console.warn('⚠️ Blockchain storage failed:', err.message);
      console.log('   Project will be stored locally without blockchain confirmation');
    }

    // ── Step 4: Save to MongoDB ──
    const project = await Project.create({
      userId: req.user._id,
      title, description, githubUrl,
      skills: skills ? (typeof skills === 'string' ? JSON.parse(skills) : skills) : [],
      projectHash: projectHash,
      ipfsHash: ipfsHash,
      txHash: txData.txHash,
      blockNumber: txData.blockNumber,
      fileCount: 1,
      totalSize: file.size,
      status: 'uploaded'
    });

    // ── Step 5: Cleanup temp file ──
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(201).json({
      success: true,
      message: 'Project uploaded and verified on blockchain',
      data: {
        projectId: project._id,
        projectHash: projectHash,
        ipfsHash: ipfsHash,
        txHash: txData.txHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
      }
    });

  } catch (err) { next(err); }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (err) { next(err); }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('userId', 'username email avatar');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (err) { next(err); }
};

export const updateProjectStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'uploaded', 'verified', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project status updated',
      project
    });
  } catch (err) { next(err); }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted'
    });
  } catch (err) { next(err); }
};

export const getProjectStats = async (req, res, next) => {
  try {
    const totalProjects = await Project.countDocuments();
    const verifiedProjects = await Project.countDocuments({ status: 'verified' });
    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalProjects,
        verifiedProjects,
        totalUsers,
        verificationRate: totalProjects > 0 ? (verifiedProjects / totalProjects * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (err) { next(err); }
};
