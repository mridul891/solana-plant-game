import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { PlantType, Plant, GAME_LEVELS, PLANT_TYPES } from './types/game';
import PlantShop from './components/PlantShop';
import Garden from './components/Garden';
import styled from 'styled-components';
import authService from './services/authService';
import UserProfile from './components/UserProfile';
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 1rem 0;
  text-align: center;
  color: #4CAF50;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const WalletSection = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 100;
`;

const WalletButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background: #45a049;
  }
`;

const ShopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #45a049;
  }
`;

const WATER_COST = 0; // Free water
const PESTICIDE_COST = 0.1; // 0.1 SOL
const WATER_THRESHOLD = 20; // When water level drops below this, health decreases
const HEALTH_DECREASE_INTERVAL = 10000; // 10 seconds
const WATER_DECREASE_INTERVAL = 5000; // 5 seconds
const GAME_TREASURY_ADDRESS = new PublicKey('vewYZ99H7JzNdHuEEosLrv3wWa2iPh8o8A6ciof8Fw3');
const PLANT_COOLDOWN = 5 * 60 * 1000; // 5 minutes

const AppContent: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [level, setLevel] = useState(GAME_LEVELS[0]);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [nextPlantTime, setNextPlantTime] = useState(0);
  const [waterUsedToday, setWaterUsedToday] = useState(0);

  useEffect(() => {
    // Check plants for disease and growth every 10 seconds
    const interval = setInterval(() => {
      setPlants(prevPlants =>
        prevPlants.map(plant => {
          const now = Date.now();
          const timeSinceLastPesticide = now - plant.lastPesticide;
          const timeSinceLastWater = now - plant.lastWatered;
          let newHealth = plant.health;
          let newGrowth = plant.growth;
          let newDiseaseLevel = plant.diseaseLevel;
          let needsPesticide = plant.needsPesticide;

          // Decrease health if not watered
          if (timeSinceLastWater > WATER_DECREASE_INTERVAL) {
            newHealth = Math.max(0, newHealth - 5);
          }

          // Increase disease level over time
          if (timeSinceLastPesticide > 30000) { // 30 seconds for testing, adjust as needed
            newDiseaseLevel = Math.min(100, newDiseaseLevel + 2);
            if (newDiseaseLevel > level.diseaseThreshold) {
              needsPesticide = true;
              newHealth = Math.max(0, newHealth - 2); // Health decreases when diseased
            }
          }

          // Growth logic with variations based on plant type
          if (newHealth > 50 && timeSinceLastWater < WATER_DECREASE_INTERVAL) {
            const growthRate = PLANT_TYPES[plant.type].growthTimeMultiplier;
            newGrowth = Math.min(100, newGrowth + (1 * growthRate));
            
            // Add score when plant grows
            if (newGrowth > plant.growth && newGrowth % 10 === 0) {
              const scoreMultiplier = PLANT_TYPES[plant.type].scoreMultiplier;
              setScore(prev => prev + (10 * scoreMultiplier));
            }
          }

          return {
            ...plant,
            health: newHealth,
            growth: newGrowth,
            diseaseLevel: newDiseaseLevel,
            needsPesticide
          };
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [level]);

  const handleBuyPesticide = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: GAME_TREASURY_ADDRESS,
          lamports: LAMPORTS_PER_SOL * 0.1, // 0.1 SOL for pesticide
        })
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;

      if (!wallet.signTransaction) {
        throw new Error('Wallet does not support signing transactions');
      }

      const signedTx = await wallet.signTransaction(transaction);
      const txId = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txId);

      setIsShopOpen(false);
      toast.success('Pesticide purchased successfully!');
      
      // Update balance after purchase
      const newBalance = await connection.getBalance(wallet.publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Purchase failed. Please try again.');
    }
  };

  const handleAddPlant = (type: PlantType) => {
    if (plants.length >= level.maxPlants) {
      toast.error('Maximum plants reached for current level');
      return;
    }

    if (Date.now() < nextPlantTime) {
      toast.error('Please wait before adding another plant');
      return;
    }

    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      type: PlantType.SUNFLOWER, // Default to Sunflower for new plants
      health: 100,
      growth: 0,
      lastWatered: Date.now(),
      lastPesticide: Date.now(),
      needsPesticide: false,
      diseaseLevel: 0,
      waterCount: 0,
      diseased: false
    };

    setPlants(prev => [...prev, newPlant]);
    setNextPlantTime(Date.now() + PLANT_COOLDOWN);
    setIsShopOpen(false);
    toast.success('Plant added successfully!');
  };

  const handleWaterPlant = (plantId: string) => {
    if (waterUsedToday >= level.dailyWaterLimit) {
      toast.error("You've reached your daily water limit!");
      return;
    }

    setPlants(prevPlants =>
      prevPlants.map(plant => {
        if (plant.id === plantId) {
          return {
            ...plant,
            lastWatered: Date.now(),
            waterCount: plant.waterCount + 1,
            health: Math.min(100, plant.health + 10)
          };
        }
        return plant;
      })
    );

    setWaterUsedToday(prev => prev + 1);
    setScore(prev => prev + Math.floor(level.id * 5));
    toast.success('Plant watered successfully!');
  };

  const handleLevelUp = () => {
    if (level) {
      if (score >= level.scoreToNextLevel) {
        const newLevelId = level.id + 1;
        const newLevel = GAME_LEVELS.find((l) => l.id === newLevelId);
        
        if (newLevel) {
          setLevel(newLevel);
          toast.success(`Level Up! You're now level ${newLevelId}!`);
          
          // Add bonus plants for level up
          if (newLevelId <= 5) { // Only add new plants up to level 5
            const newPlant: Plant = {
              id: `plant-${Date.now()}`,
              type: PlantType.SUNFLOWER, // Default to Sunflower for new plants
              health: 100,
              growth: 0,
              lastWatered: Date.now(),
              lastPesticide: Date.now(),
              needsPesticide: false,
              diseaseLevel: 0,
              waterCount: 0,
              diseased: false
            };
            setPlants([...plants, newPlant]);
          }
        }
      }
    }
  };

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        setSignInError('Please connect your wallet first');
        return;
      }
      if (!email) {
        setSignInError('Please enter your email');
        return;
      }
      
      const user = await authService.signIn(email, wallet.publicKey?.toString() || '');
      setShowSignIn(false);
      setSignInError('');
      
      // Reset email after successful sign in
      setEmail('');
      toast.success('Successfully signed in!');
    } catch (error) {
      setSignInError('Sign in failed. Please try again.');
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = () => {
    authService.signOut();
    setIsProfileOpen(false);
  };

  useEffect(() => {
    handleLevelUp();
  }, [score, level]);

  return (
    <AppContainer>
      <ToastContainer position="top-right" autoClose={5000} />
      <Header>
        <Title>Solana Plant Game</Title>
        <WalletSection>
          <WalletMultiButton />
          {authService.isAuthenticated() ? (
            <>
              <WalletButton onClick={() => setIsProfileOpen(true)}>
                {authService.getCurrentUser()?.username}
              </WalletButton>
              <WalletButton onClick={handleSignOut}>
                Sign Out
              </WalletButton>
            </>
          ) : (
            <WalletButton onClick={() => setShowSignIn(true)}>
              Sign In
            </WalletButton>
          )}
        </WalletSection>
      </Header>

      {showSignIn && (
        <SignInModal>
          <SignInCard>
            <h2>Sign In to Your Garden</h2>
            {signInError && <ErrorMessage>{signInError}</ErrorMessage>}
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SignInButton onClick={handleSignIn}>
              Sign In with Wallet
            </SignInButton>
            <CloseButton onClick={() => setShowSignIn(false)}>×</CloseButton>
          </SignInCard>
        </SignInModal>
      )}

      {isProfileOpen && authService.getCurrentUser() && (
        <UserProfile
          user={authService.getCurrentUser()!}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      <Garden
        plants={plants}
        currentLevel={level}
        onWater={(plantId: string) => handleWaterPlant(plantId)}
        onUsePesticide={(plantId: string) => {
          if (!level.pesticideUnlocked) {
            toast.error('Pesticides are not yet unlocked!');
            return;
          }

          const plant = plants.find(p => p.id === plantId);
          if (!plant?.needsPesticide) {
            toast.error('This plant doesn\'t need pesticide right now!');
            return;
          }

          setPlants(prevPlants =>
            prevPlants.map(plant => {
              if (plant.id === plantId) {
                return {
                  ...plant,
                  lastPesticide: Date.now(),
                  needsPesticide: false,
                  diseaseLevel: 0
                };
              }
              return plant;
            })
          );
          toast.success('Applied pesticide successfully!');
        }}
        canWater={waterUsedToday < level.dailyWaterLimit}
        canUsePesticide={level.pesticideUnlocked}
      />

      <PlantShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onBuyPlant={handleAddPlant}
        onBuyPesticide={handleBuyPesticide}
        onBuyWater={() => {
          if (waterUsedToday >= level.dailyWaterLimit) {
            toast.error('Daily water limit reached');
            return;
          }
          setWaterUsedToday(prev => prev + 5);
          setIsShopOpen(false);
          toast.success('Water added successfully!');
        }}
        currentLevel={level}
        canBuyPlant={plants.length < level.maxPlants && Date.now() >= nextPlantTime}
        canBuyPesticide={level.pesticideUnlocked}
        canBuyWater={waterUsedToday < level.dailyWaterLimit}
        nextPlantTime={nextPlantTime}
        pesticidesNeeded={plants.some(p => p.needsPesticide)}
        solBalance={balance}
      />

      <ShopButton onClick={() => setIsShopOpen(true)}>
        Open Shop
      </ShopButton>
    </AppContainer>
  );
};

const SignInModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SignInCard = styled.div`
  background: #2d2d2d;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;

  h2 {
    margin: 0 0 20px 0;
    color: #4CAF50;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #4CAF50;
  border-radius: 8px;
  background: #1a1a1a;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #45a049;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #45a049;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  margin: 10px 0;
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  line-height: 1;

  &:hover {
    color: white;
  }
`;

const App: React.FC = () => {
  // Set up Solana wallet configuration
  const wallets = [new PhantomWalletAdapter()];
  const endpoint = clusterApiUrl('devnet');

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
