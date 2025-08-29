// Hackverse Pro Authentication Service
import { db } from './database.js';

// Simulated JWT token storage
const tokenStorage = new Map();
const refreshTokens = new Map();

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  // User Registration
  async register(userData) {
    try {
      // Validate user data
      if (!userData.username || !userData.email || !userData.password) {
        throw new Error('Missing required fields');
      }

      // Check if username already exists
      const existingUser = await db.getUserByUsername(userData.username);
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // Check if email already exists
      const existingEmail = await db.getUserByEmail(userData.email);
      if (existingEmail) {
        throw new Error('Email already exists');
      }

      // Hash password (in real app, use bcrypt)
      const hashedPassword = this.hashPassword(userData.password);

      // Create user
      const newUser = await db.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = this.generateToken(newUser);
      const refreshToken = this.generateRefreshToken(newUser.id);

      // Store tokens
      tokenStorage.set(token, newUser.id);
      refreshTokens.set(refreshToken, newUser.id);

      // Set current user
      this.currentUser = newUser;
      this.isAuthenticated = true;

      return {
        user: newUser,
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // User Login
  async login(credentials) {
    try {
      const { username, password } = credentials;

      // Find user by username or email
      let user = await db.getUserByUsername(username);
      if (!user) {
        user = await db.getUserByEmail(username);
      }

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      if (!this.verifyPassword(password, user.password)) {
        throw new Error('Invalid credentials');
      }

      // Update last active
      await db.updateUser(user.id, { lastActive: new Date().toISOString() });

      // Generate tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user.id);

      // Store tokens
      tokenStorage.set(token, user.id);
      refreshTokens.set(refreshToken, user.id);

      // Set current user
      this.currentUser = user;
      this.isAuthenticated = true;

      return {
        user,
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // User Logout
  async logout() {
    try {
      if (this.currentUser) {
        // Remove tokens
        const userTokens = Array.from(tokenStorage.entries())
          .filter(([token, userId]) => userId === this.currentUser.id);
        
        userTokens.forEach(([token]) => tokenStorage.delete(token));

        // Clear current user
        this.currentUser = null;
        this.isAuthenticated = false;

        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  // Verify Token
  verifyToken(token) {
    try {
      if (!tokenStorage.has(token)) {
        return null;
      }

      const userId = tokenStorage.get(token);
      return userId;
    } catch (error) {
      return null;
    }
  }

  // Refresh Token
  async refreshToken(refreshToken) {
    try {
      if (!refreshTokens.has(refreshToken)) {
        throw new Error('Invalid refresh token');
      }

      const userId = refreshTokens.get(refreshToken);
      const user = await db.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user.id);

      // Update token storage
      tokenStorage.delete(token);
      refreshTokens.delete(refreshToken);
      tokenStorage.set(newToken, userId);
      refreshTokens.set(newRefreshToken, userId);

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  // Get Current User
  async getCurrentUser() {
    return this.currentUser;
  }

  // Update User Profile
  async updateProfile(userId, updates) {
    try {
      const updatedUser = await db.updateUser(userId, updates);
      
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = updatedUser;
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Change Password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await db.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      if (!this.verifyPassword(currentPassword, user.password)) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = this.hashPassword(newPassword);

      // Update password
      await db.updateUser(userId, { password: hashedNewPassword });

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Check Authentication Status
  checkAuth() {
    return this.isAuthenticated;
  }

  // Require Authentication (for protected routes)
  requireAuth() {
    if (!this.isAuthenticated) {
      throw new Error('Authentication required');
    }
    return this.currentUser;
  }

  // Utility Methods
  hashPassword(password) {
    // In a real app, use bcrypt or similar
    // This is just a simple hash for demo purposes
    return btoa(password + '_hackverse_salt');
  }

  verifyPassword(password, hashedPassword) {
    const hashedInput = this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  generateToken(user) {
    // In a real app, use proper JWT library
    // This is just a simple token for demo purposes
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    return btoa(JSON.stringify(payload));
  }

  generateRefreshToken(userId) {
    // In a real app, use proper JWT library
    const payload = {
      userId,
      type: 'refresh',
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    return btoa(JSON.stringify(payload));
  }

  // Password Reset (simplified)
  async requestPasswordReset(email) {
    try {
      const user = await db.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, send email with reset link
      // For demo, just return success
      return {
        message: 'Password reset email sent',
        email: user.email
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify Email (simplified)
  async verifyEmail(userId) {
    try {
      await db.updateUser(userId, { isVerified: true });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const auth = new AuthService();
