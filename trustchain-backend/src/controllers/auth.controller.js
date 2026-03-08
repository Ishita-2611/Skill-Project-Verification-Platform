import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRE }
);

// ── Register ──
export const register = async (req, res) => {
  try {
    console.log('Register request:', req.body);
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('Missing fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Checking existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(409).json({ error: 'Email already registered' });
    }

    console.log('Creating user...');
    const user = await User.create({ username, email, password, role });
    console.log('User created:', user._id);

    console.log('Generating token...');
    const token = generateToken(user._id);

    console.log('Sending response...');
    res.status(201).json({
      success: true, token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Login ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Get Current User ──
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user
    });
  } catch (err) { next(err); }
};

// ── Update Profile ──
export const updateProfile = async (req, res, next) => {
  try {
    const { bio, avatar, skills, githubUrl, walletAddress } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, avatar, skills, githubUrl, walletAddress },
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: 'Profile updated',
      user
    });
  } catch (err) { next(err); }
};
