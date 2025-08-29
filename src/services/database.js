// Hackverse Pro Database Service
// This simulates a real database with proper relationships and data structure

// Database Tables Structure
const database = {
  users: [
    {
      id: 1,
      username: 'hacker_pro',
      email: 'pro@hackverse.com',
      password: 'hashed_password_here',
      avatar: '🦹‍♂️',
      rank: 'Elite Hacker',
      level: 25,
      xp: 12500,
      totalLabsCompleted: 47,
      totalChallengesSolved: 89,
      streak: 15,
      joinDate: '2024-01-15',
      lastActive: '2024-12-20',
      achievements: ['First Blood', 'Lab Master', 'CTF Champion', 'Streak King'],
      badges: ['gold', 'silver', 'bronze'],
      isVerified: true,
      role: 'user'
    },
    {
      id: 2,
      username: 'cyber_ninja',
      email: 'ninja@hackverse.com',
      password: 'hashed_password_here',
      avatar: '🥷',
      rank: 'Security Analyst',
      level: 18,
      xp: 8900,
      totalLabsCompleted: 32,
      totalChallengesSolved: 56,
      streak: 8,
      joinDate: '2024-03-20',
      lastActive: '2024-12-20',
      achievements: ['Lab Master', 'Quick Learner'],
      badges: ['silver', 'bronze'],
      isVerified: true,
      role: 'user'
    },
    {
      id: 3,
      username: 'newbie_hacker',
      email: 'newbie@hackverse.com',
      password: 'hashed_password_here',
      avatar: '🦊',
      rank: 'Script Kiddie',
      level: 5,
      xp: 1200,
      totalLabsCompleted: 8,
      totalChallengesSolved: 12,
      streak: 3,
      joinDate: '2024-11-01',
      lastActive: '2024-12-20',
      achievements: ['First Steps'],
      badges: ['bronze'],
      isVerified: true,
      role: 'user'
    }
  ],

  labs: [
    {
      id: 1,
      name: 'SSH Brute Force Lab',
      description: 'Practice SSH brute force attacks on a vulnerable Linux machine',
      difficulty: 'Easy',
      category: 'Network Security',
      tags: ['SSH', 'Brute Force', 'Linux', 'Network'],
      estimatedTime: '1-2 hours',
      xpReward: 200,
      flags: ['FLAG{SSH_BRUTE_MASTER}', 'FLAG{USER_ENUMERATION}', 'FLAG{ROOT_ACCESS}'],
      prerequisites: [],
      status: 'active',
      machineType: 'vulnerable_linux',
      ipAddress: '192.168.1.100',
      sshPort: 22,
      hints: [
        'Try common usernames like admin, root, user',
        'Use tools like hydra or medusa for brute force',
        'Check for default credentials',
        'Look for SSH configuration vulnerabilities'
      ],
      walkthrough: 'https://hackverse.com/walkthroughs/ssh-brute-force',
      communityRating: 4.7,
      completionRate: 78,
      machineImage: 'hackverse/ssh-vuln-linux:latest',
      ports: { 22: 2222, 80: 8080 },
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-12-20'
    },
    {
      id: 2,
      name: 'Web Application Firewall Bypass',
      description: 'Learn to bypass WAF protection and exploit web vulnerabilities',
      difficulty: 'Medium',
      category: 'Web Security',
      tags: ['WAF', 'Web Security', 'SQL Injection', 'XSS'],
      estimatedTime: '2-3 hours',
      xpReward: 350,
      flags: ['FLAG{WAF_BYPASS_MASTER}', 'FLAG{SQL_INJECTION}', 'FLAG{XSS_EXPLOIT}'],
      prerequisites: ['Basic web security knowledge'],
      status: 'active',
      machineType: 'web_application',
      ipAddress: '192.168.1.101',
      webPort: 80,
      hints: [
        'Try different encoding techniques',
        'Use HTTP headers to bypass WAF',
        'Test for SQL injection with various payloads',
        'Look for XSS vulnerabilities in input fields'
      ],
      walkthrough: 'https://hackverse.com/walkthroughs/waf-bypass',
      communityRating: 4.9,
      completionRate: 65,
      machineImage: 'hackverse/waf-bypass-web:latest',
      ports: { 80: 8081, 443: 8443 },
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-12-20'
    },
    {
      id: 3,
      name: 'Active Directory Exploitation',
      description: 'Master Active Directory attacks and privilege escalation',
      difficulty: 'Hard',
      category: 'Windows Security',
      tags: ['Active Directory', 'Windows', 'Kerberos', 'Privilege Escalation'],
      estimatedTime: '4-6 hours',
      xpReward: 500,
      flags: ['FLAG{AD_MASTER}', 'FLAG{KERBEROS_EXPLOIT}', 'FLAG{DOMAIN_ADMIN}'],
      prerequisites: ['Windows security basics', 'Network fundamentals'],
      status: 'active',
      machineType: 'windows_domain',
      ipAddress: '192.168.1.102',
      domain: 'hackverse.local',
      hints: [
        'Start with user enumeration',
        'Use tools like BloodHound for AD mapping',
        'Look for misconfigured permissions',
        'Try Kerberoasting attacks'
      ],
      walkthrough: 'https://hackverse.com/walkthroughs/active-directory',
      communityRating: 4.8,
      completionRate: 45,
      machineImage: 'hackverse/ad-vuln-windows:latest',
      ports: { 80: 8082, 389: 3389, 445: 4445 },
      isActive: true,
      createdAt: '2024-02-01',
      updatedAt: '2024-12-20'
    }
  ],

  challenges: [
    {
      id: 1,
      name: 'Reverse Engineering Challenge',
      description: 'Reverse engineer this binary to find the hidden flag',
      difficulty: 'Medium',
      category: 'Reverse Engineering',
      tags: ['Reverse Engineering', 'Binary Analysis', 'Assembly'],
      xpReward: 150,
      flag: 'FLAG{REVERSE_ENGINEERING_MASTER}',
      hints: [
        'Use tools like Ghidra or IDA Pro',
        'Look for strings in the binary',
        'Analyze the main function',
        'Check for hardcoded values'
      ],
      files: ['challenge.bin'],
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Cryptography Puzzle',
      description: 'Decrypt this message using the provided clues',
      difficulty: 'Easy',
      category: 'Cryptography',
      tags: ['Cryptography', 'Encryption', 'Decryption'],
      xpReward: 100,
      flag: 'FLAG{CRYPTO_MASTER}',
      hints: [
        'Look for patterns in the encrypted text',
        'Try different substitution ciphers',
        'Check for frequency analysis',
        'Look for the key in the description'
      ],
      files: ['encrypted.txt', 'hint.txt'],
      isActive: true,
      createdAt: '2024-01-10'
    }
  ],

  userProgress: {
    1: { // user ID
      completedLabs: [1, 2],
      completedChallenges: [1, 2],
      currentLab: null,
      labStartTime: null,
      totalTimeSpent: 15600, // seconds
      achievements: ['First Blood', 'Lab Master'],
      streak: 15,
      lastActivity: '2024-12-20'
    },
    2: {
      completedLabs: [1],
      completedChallenges: [1],
      currentLab: null,
      labStartTime: null,
      totalTimeSpent: 8900,
      achievements: ['First Blood'],
      streak: 8,
      lastActivity: '2024-12-20'
    },
    3: {
      completedLabs: [],
      completedChallenges: [],
      currentLab: null,
      labStartTime: null,
      totalTimeSpent: 1200,
      achievements: [],
      streak: 3,
      lastActivity: '2024-12-20'
    }
  },

  activeSessions: {},
  leaderboard: [],
  achievements: [
    { id: 1, name: 'First Blood', description: 'Complete your first lab', icon: '🩸' },
    { id: 2, name: 'Lab Master', description: 'Complete 10 labs', icon: '🏆' },
    { id: 3, name: 'CTF Champion', description: 'Solve 25 challenges', icon: '👑' },
    { id: 4, name: 'Streak King', description: 'Maintain a 30-day streak', icon: '🔥' }
  ]
};

// Database Service Class
export class DatabaseService {
  constructor() {
    this.db = database;
  }

  // User Management
  async createUser(userData) {
    const newUser = {
      id: this.db.users.length + 1,
      ...userData,
      rank: 'Script Kiddie',
      level: 1,
      xp: 0,
      totalLabsCompleted: 0,
      totalChallengesSolved: 0,
      streak: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString().split('T')[0],
      achievements: [],
      badges: ['bronze'],
      isVerified: false,
      role: 'user'
    };
    
    this.db.users.push(newUser);
    this.db.userProgress[newUser.id] = {
      completedLabs: [],
      completedChallenges: [],
      currentLab: null,
      labStartTime: null,
      totalTimeSpent: 0,
      achievements: [],
      streak: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    
    return newUser;
  }

  async getUserById(id) {
    return this.db.users.find(user => user.id === id);
  }

  async getUserByUsername(username) {
    return this.db.users.find(user => user.username === username);
  }

  async getUserByEmail(email) {
    return this.db.users.find(user => user.email === email);
  }

  async updateUser(id, updates) {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.db.users[userIndex] = { ...this.db.users[userIndex], ...updates };
      return this.db.users[userIndex];
    }
    return null;
  }

  // Lab Management
  async getLabs(filters = {}) {
    let labs = [...this.db.labs];
    
    if (filters.difficulty) {
      labs = labs.filter(lab => lab.difficulty === filters.difficulty);
    }
    
    if (filters.category) {
      labs = labs.filter(lab => lab.category === filters.category);
    }
    
    if (filters.status) {
      labs = labs.filter(lab => lab.status === filters.status);
    }
    
    return labs;
  }

  async getLabById(id) {
    return this.db.labs.find(lab => lab.id === id);
  }

  async startLab(userId, labId) {
    const user = await this.getUserById(userId);
    const lab = await this.getLabById(labId);
    
    if (!user || !lab) return null;
    
    // Update user progress
    this.db.userProgress[userId].currentLab = labId;
    this.db.userProgress[userId].labStartTime = new Date().toISOString();
    
    // Create active session
    this.db.activeSessions[`${userId}_${labId}`] = {
      userId,
      labId,
      startTime: new Date().toISOString(),
      status: 'active'
    };
    
    return lab;
  }

  async stopLab(userId, labId) {
    const sessionKey = `${userId}_${labId}`;
    if (this.db.activeSessions[sessionKey]) {
      delete this.db.activeSessions[sessionKey];
      
      // Update user progress
      this.db.userProgress[userId].currentLab = null;
      this.db.userProgress[userId].labStartTime = null;
      
      return true;
    }
    return false;
  }

  // Challenge Management
  async getChallenges(filters = {}) {
    let challenges = [...this.db.challenges];
    
    if (filters.difficulty) {
      challenges = challenges.filter(challenge => challenge.difficulty === filters.difficulty);
    }
    
    if (filters.category) {
      challenges = challenges.filter(challenge => challenge.category === filters.category);
    }
    
    return challenges;
  }

  async submitChallengeFlag(userId, challengeId, flag) {
    const challenge = this.db.challenges.find(c => c.id === challengeId);
    const user = await this.getUserById(userId);
    
    if (!challenge || !user) return false;
    
    if (challenge.flag === flag) {
      // Update user progress
      if (!this.db.userProgress[userId].completedChallenges.includes(challengeId)) {
        this.db.userProgress[userId].completedChallenges.push(challengeId);
        user.totalChallengesSolved++;
        user.xp += challenge.xpReward;
        
        // Check for level up
        this.checkLevelUp(user);
        
        // Check for achievements
        this.checkAchievements(userId);
      }
      
      return true;
    }
    
    return false;
  }

  // Progress Tracking
  async getUserProgress(userId) {
    return this.db.userProgress[userId] || null;
  }

  async updateUserProgress(userId, updates) {
    if (this.db.userProgress[userId]) {
      this.db.userProgress[userId] = { ...this.db.userProgress[userId], ...updates };
      return this.db.userProgress[userId];
    }
    return null;
  }

  // Achievement System
  async checkAchievements(userId) {
    const user = await this.getUserById(userId);
    const progress = await this.getUserProgress(userId);
    
    const newAchievements = [];
    
    // First Blood achievement
    if (progress.completedLabs.length === 1 && !user.achievements.includes('First Blood')) {
      newAchievements.push('First Blood');
    }
    
    // Lab Master achievement
    if (progress.completedLabs.length >= 10 && !user.achievements.includes('Lab Master')) {
      newAchievements.push('Lab Master');
    }
    
    // CTF Champion achievement
    if (progress.completedChallenges.length >= 25 && !user.achievements.includes('CTF Champion')) {
      newAchievements.push('CTF Champion');
    }
    
    // Streak King achievement
    if (progress.streak >= 30 && !user.achievements.includes('Streak King')) {
      newAchievements.push('Streak King');
    }
    
    // Add new achievements
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
      user.xp += newAchievements.length * 100; // Bonus XP for achievements
    }
    
    return newAchievements;
  }

  // Level System
  checkLevelUp(user) {
    const newLevel = Math.floor(user.xp / 500) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
      
      // Update rank based on level
      if (user.level >= 20) user.rank = 'Elite Hacker';
      else if (user.level >= 15) user.rank = 'Security Analyst';
      else if (user.level >= 10) user.rank = 'Penetration Tester';
      else if (user.level >= 5) user.rank = 'Script Kiddie';
      else user.rank = 'Newbie';
      
      return true;
    }
    return false;
  }

  // Leaderboard
  async getLeaderboard(limit = 50) {
    const users = [...this.db.users]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        position: index + 1
      }));
    
    return users;
  }

  // Statistics
  async getStats() {
    const totalUsers = this.db.users.length;
    const totalLabs = this.db.labs.length;
    const totalChallenges = this.db.challenges.length;
    const activeUsers = Object.keys(this.db.activeSessions).length;
    
    return {
      totalUsers,
      totalLabs,
      totalChallenges,
      activeUsers,
      totalCompletions: this.db.users.reduce((sum, user) => sum + user.totalLabsCompleted, 0)
    };
  }
}

// Export singleton instance
export const db = new DatabaseService();
