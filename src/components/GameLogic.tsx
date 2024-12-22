import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { PlantStage, PlantStatus } from '../types/game';

// This is a demo wallet address - replace with your actual wallet address
const GAME_TREASURY_WALLET = "DxauYExURhJDGqVCJ2vhRCQU9z2FWVqKGLu2FZX8DBVT";

// Game constants
const GROWTH_STAGES = {
  SEED: 0,
  SPROUT: 1,
  JUVENILE: 2,
  MATURE: 3,
  FLOWERING: 4
};

const STAGE_DURATIONS = {
  [GROWTH_STAGES.SEED]: 1 * 60 * 1000, // 1 minute for demo, adjust as needed
  [GROWTH_STAGES.SPROUT]: 5 * 60 * 1000,
  [GROWTH_STAGES.JUVENILE]: 15 * 60 * 1000,
  [GROWTH_STAGES.MATURE]: 30 * 60 * 1000,
  [GROWTH_STAGES.FLOWERING]: 60 * 60 * 1000
};

export const handlePesticidePurchase = async (
  wallet: WalletContextState,
  connection: Connection,
  pesticideCost: number,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    onError(new Error("Wallet not connected"));
    return;
  }

  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(GAME_TREASURY_WALLET),
        lamports: LAMPORTS_PER_SOL * pesticideCost,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signature = await wallet.sendTransaction(transaction, connection);
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new Error("Transaction failed");
    }

    onSuccess();
  } catch (error) {
    console.error("Error in pesticide purchase:", error);
    onError(error);
  }
};

export const handleWaterPurchase = async (
  wallet: WalletContextState,
  connection: Connection,
  waterCost: number,
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  if (!wallet.publicKey || !wallet.signTransaction) {
    onError(new Error("Wallet not connected"));
    return;
  }

  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(GAME_TREASURY_WALLET),
        lamports: LAMPORTS_PER_SOL * waterCost,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    const signature = await wallet.sendTransaction(transaction, connection);
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new Error("Transaction failed");
    }

    onSuccess();
  } catch (error) {
    console.error("Error in water purchase:", error);
    onError(error);
  }
};

export const checkWalletBalance = async (
  wallet: WalletContextState,
  connection: Connection
): Promise<number> => {
  if (!wallet.publicKey) return 0;
  
  try {
    const balance = await connection.getBalance(wallet.publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error checking balance:", error);
    return 0;
  }
};

export const calculatePlantStatus = (
  lastWatered: Date,
  currentStage: number,
  lastPesticideApplication: Date
): PlantStatus => {
  const now = new Date();
  const wateringThreshold = 12 * 60 * 60 * 1000; // 12 hours
  const pesticideThreshold = 24 * 60 * 60 * 1000; // 24 hours

  const timeSinceWatering = now.getTime() - lastWatered.getTime();
  const timeSincePesticide = now.getTime() - lastPesticideApplication.getTime();

  return {
    needsWater: timeSinceWatering >= wateringThreshold,
    needsPesticide: currentStage >= GROWTH_STAGES.JUVENILE && timeSincePesticide >= pesticideThreshold,
    isHealthy: timeSinceWatering < wateringThreshold && 
              (currentStage < GROWTH_STAGES.JUVENILE || timeSincePesticide < pesticideThreshold)
  };
};

export const calculateGrowthProgress = (
  plantCreatedAt: Date,
  currentStage: number
): number => {
  const now = new Date();
  const stageStartTime = new Date(plantCreatedAt.getTime());
  
  // Add up time for completed stages
  for (let i = 0; i < currentStage; i++) {
    stageStartTime.setTime(stageStartTime.getTime() + STAGE_DURATIONS[i]);
  }
  
  const timeInCurrentStage = now.getTime() - stageStartTime.getTime();
  return Math.min(100, (timeInCurrentStage / STAGE_DURATIONS[currentStage]) * 100);
};