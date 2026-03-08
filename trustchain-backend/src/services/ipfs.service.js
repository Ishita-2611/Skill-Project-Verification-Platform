import pinataSDK from '@pinata/sdk';
import crypto from 'crypto';
import fs from 'fs';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET
);

// Upload file to IPFS via Pinata
export const uploadToIPFS = async (filePath, fileName) => {
  const readableStream = fs.createReadStream(filePath);

  const options = {
    pinataMetadata: {
      name: fileName,
      keyvalues: { project: 'TrustChain', timestamp: Date.now() }
    },
    pinataOptions: { cidVersion: 1 }
  };

  const result = await pinata.pinFileToIPFS(readableStream, options);
  return result.IpfsHash;
};

// Upload JSON metadata to IPFS
export const uploadJSONToIPFS = async (data) => {
  const result = await pinata.pinJSONToIPFS(data, {
    pinataMetadata: { name: 'TrustChain-Metadata' }
  });
  return result.IpfsHash;
};

// Generate SHA-256 hash from file buffer
export const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Generate project hash from metadata
export const generateProjectHash = (projectData) => {
  const normalized = JSON.stringify({
    title: projectData.title,
    description: projectData.description,
    githubUrl: projectData.githubUrl,
    userId: projectData.userId,
    timestamp: projectData.timestamp
  });
  return crypto.createHash('sha256').update(normalized).digest('hex');
};

// Verify IPFS connection
export const testIPFSConnection = async () => {
  try {
    const result = await pinata.testAuthentication();
    return result.authenticated;
  } catch (err) {
    console.error('IPFS Connection Error:', err.message);
    return false;
  }
};
