import { UserProfile } from '../types/user';

const STORAGE_KEY = 'plant_game_user';

class AuthService {
  private static instance: AuthService;
  private currentUser: UserProfile | null = null;

  private constructor() {
    this.loadUser();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadUser() {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  private saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUser = user;
  }

  async signIn(email: string, walletAddress: string): Promise<UserProfile> {
    // In a real app, this would make an API call to your backend
    let user = this.getUserByEmail(email);
    
    if (!user) {
      user = this.createUser(email, walletAddress);
    }

    user.lastLogin = Date.now();
    this.saveUser(user);
    return user;
  }

  signOut(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUser = null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  private getUserByEmail(email: string): UserProfile | null {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  private createUser(email: string, walletAddress: string): UserProfile {
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      username: email.split('@')[0],
      email,
      walletAddress,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      gameStats: {
        totalPlants: 0,
        highestLevel: 1,
        totalScore: 0,
        achievements: [],
      },
    };
    return newUser;
  }

  updateGameStats(stats: Partial<UserProfile['gameStats']>): void {
    if (!this.currentUser) return;

    this.currentUser.gameStats = {
      ...this.currentUser.gameStats,
      ...stats,
    };
    this.saveUser(this.currentUser);
  }

  addAchievement(achievementId: string): void {
    if (!this.currentUser) return;

    if (!this.currentUser.gameStats.achievements.includes(achievementId)) {
      this.currentUser.gameStats.achievements.push(achievementId);
      this.saveUser(this.currentUser);
    }
  }
}

export default AuthService.getInstance();
