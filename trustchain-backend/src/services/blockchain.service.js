import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACT_ABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/abi.json'), 'utf-8'));

let provider, signer, contract;

export const initBlockchain = () => {
  try {
    provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
    signer   = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    console.log('✅ Blockchain service initialized');
  } catch (err) {
    console.error('⚠️ Blockchain initialization warning:', err.message);
    console.log('   Make sure CONTRACT_ADDRESS and PRIVATE_KEY are set in .env');
  }
};

// Store project hash on blockchain
export const storeProjectHash = async (
  userAddress, projectHash, ipfsHash
) => {
  try {
    if (!contract) {
      throw new Error('Blockchain not initialized. Check .env configuration.');
    }

    const tx = await contract.uploadProject(
      userAddress, projectHash, ipfsHash
    );
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (err) {
    console.error('Error storing project hash:', err.message);
    throw err;
  }
};

// Verify project hash on chain
export const verifyHash = async (userAddress, projectHash) => {
  try {
    if (!contract) {
      throw new Error('Blockchain not initialized');
    }
    return await contract.verifyProjectHash(userAddress, projectHash);
  } catch (err) {
    console.error('Error verifying hash:', err.message);
    throw err;
  }
};

// Get user reputation score
export const getReputationScore = async (address) => {
  try {
    if (!contract) {
      throw new Error('Blockchain not initialized');
    }
    const score = await contract.reputationScores(address);
    return parseInt(score.toString());
  } catch (err) {
    console.error('Error getting reputation score:', err.message);
    throw err;
  }
};
