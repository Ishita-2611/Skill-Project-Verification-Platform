// Blockchain Configuration for Ethers.js
// This file initializes the provider, signer, and contract instance

export const blockchainConfig = {
  infuraUrl: process.env.INFURA_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  privateKey: process.env.PRIVATE_KEY,
  network: 'sepolia'
};
