import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// This is a demo wallet address - replace with your actual wallet address
const GAME_TREASURY_WALLET = "DxauYExURhJDGqVCJ2vhRCQU9z2FWVqKGLu2FZX8DBVT";

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
