// Enhanced API service with comprehensive features
import { toast } from 'sonner';

// Simulated database
let users = [
  { id: 1, username: 'hacker_pro', email: 'pro@hackverse.com', level: 'Advanced', xp: 2500, rank: 'Elite Hacker', avatar: '🦹‍♂️' },
  { id: 2, username: 'cyber_ninja', email: 'ninja@hackverse.com', level: 'Intermediate', xp: 1200, rank: 'Security Analyst', avatar: '🥷' },
  { id: 3, username: 'code_breaker', email: 'breaker@hackverse.com', level: 'Beginner', xp: 400, rank: 'Script Kiddie', avatar: '🔓' }
];

let labs = [
  {
    id: 1,
    name: 'DVWA - Damn Vulnerable Web App',
    description: 'Master OWASP Top 10 vulnerabilities with hands-on practice',
    difficulty: 'Easy',
    category: 'Web Security',
    tags: ['SQL Injection', 'XSS', 'CSRF', 'File Upload'],
    estimatedTime: '2-3 hours',
    xpReward: 150,
    flags: ['FLAG{SQL_INJECTION_MASTER}', 'FLAG{XSS_EXPLOIT}', 'FLAG{CSRF_BYPASS}'],
    prerequisites: [],
    status: 'available',
    containerImage: 'vulnerables/web-dvwa',
    ports: { 80: 8081, 3306: 3307 },
    hints: [
      'Try using single quotes in the login form',
      'Check the source code for hidden comments',
      'Look for file upload vulnerabilities'
    ],
    walkthrough: 'https://hackverse.com/walkthroughs/dvwa',
    communityRating: 4.8,
    completionRate: 87
  },
  {
    id: 2,
    name: 'Juice Shop - OWASP Training Ground',
    description: 'Advanced web application security challenges with real-world scenarios',
    difficulty: 'Medium',
    category: 'Web Security',
    tags: ['API Security', 'Authentication Bypass', 'Business Logic', 'NoSQL Injection'],
    estimatedTime: '4-6 hours',
    xpReward: 300,
    flags: ['FLAG{API_EXPLOIT}', 'FLAG{AUTH_BYPASS}', 'FLAG{BUSINESS_LOGIC_FLAW}'],
    prerequisites: ['DVWA'],
    status: 'available',
    containerImage: 'bkimminich/juice-shop',
    ports: { 3000: 8082 },
    hints: [
      'Check the admin panel for hidden features',
      'Look for IDOR vulnerabilities',
      'Try manipulating the shopping cart'
    ],
    walkthrough: 'https://hackverse.com/walkthroughs/juice-shop',
    communityRating: 4.9,
    completionRate: 73
  },
  {
    id: 3,
    name: 'Metasploitable - Penetration Testing Lab',
    description: 'Comprehensive penetration testing environment with multiple attack vectors',
    difficulty: 'Hard',
    category: 'Penetration Testing',
    tags: ['Exploitation', 'Privilege Escalation', 'Post Exploitation', 'Network Enumeration'],
    estimatedTime: '6-8 hours',
    xpReward: 500,
    flags: ['FLAG{ROOT_SHELL}', 'FLAG{PRIVILEGE_ESCALATION}', 'FLAG{NETWORK_PWN}'],
    prerequisites: ['Juice Shop'],
    status: 'available',
    containerImage: 'tleemcjr/metasploitable2',
    ports: { 22: 2222, 21: 2121, 23: 2323, 80: 8083 },
    hints: [
      'Start with port scanning and service enumeration',
      'Look for default credentials',
      'Check for known vulnerabilities in running services'
    ],
    walkthrough: 'https://hackverse.com/walkthroughs/metasploitable',
    communityRating: 4.7,
    completionRate: 58
  },
  {
    id: 4,
    name: 'Windows Active Directory Lab',
    description: 'Realistic Windows domain environment for AD exploitation',
    difficulty: 'Expert',
    category: 'Active Directory',
    tags: ['Kerberos', 'Golden Ticket', 'BloodHound', 'Lateral Movement'],
    estimatedTime: '8-12 hours',
    xpReward: 800,
    flags: ['FLAG{DOMAIN_ADMIN}', 'FLAG{GOLDEN_TICKET}', 'FLAG{DC_SYNC}'],
    prerequisites: ['Metasploitable'],
    status: 'available',
    containerImage: 'hackverse/windows-ad-lab',
    ports: { 389: 389, 636: 636, 88: 88, 135: 135 },
    hints: [
      'Start with domain enumeration using PowerView',
      'Look for misconfigured Group Policy Objects',
      'Check for Kerberoasting opportunities'
    ],
    walkthrough: 'https://hackverse.com/walkthroughs/windows-ad',
    communityRating: 4.6,
    completionRate: 42
  }
];

let userProgress = {};
let activeContainers = {};
let leaderboard = [];

// Enhanced API service
export const useApi = () => {
  return {
    // Authentication & User Management
    login: async (credentials) => {
      const user = users.find(u => u.email === credentials.email);
      if (user && credentials.password === 'password') {
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      throw new Error('Invalid credentials');
    },

    register: async (userData) => {
      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        level: 'Beginner',
        xp: 0,
        rank: 'Script Kiddie',
        avatar: '🆕'
      };
      users.push(newUser);
      return { success: true, user: newUser };
    },

    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },

    logout: () => {
      localStorage.removeItem('user');
      return { success: true };
    },

    // Lab Management
    getLabs: async () => {
      return labs.map(lab => ({
        ...lab,
        isCompleted: userProgress[lab.id]?.completed || false,
        progress: userProgress[lab.id]?.progress || 0,
        timeSpent: userProgress[lab.id]?.timeSpent || 0
      }));
    },

    getLabById: async (id) => {
      return labs.find(lab => lab.id === parseInt(id));
    },

    startLab: async (lab) => {
      const containerId = `container_${Date.now()}`;
      const ports = {};
      
      // Simulate port mapping
      Object.entries(lab.ports).forEach(([internal, external]) => {
        ports[internal] = external;
      });

      activeContainers[lab.id] = {
        containerId,
        labId: lab.id,
        startTime: Date.now(),
        ports,
        status: 'running'
      };

      // Update user progress
      if (!userProgress[lab.id]) {
        userProgress[lab.id] = { started: true, progress: 0, timeSpent: 0 };
      }

      toast.success(`🚀 ${lab.name} started successfully!`);
      return { containerId, ports, status: 'running' };
    },

    stopLab: async (lab) => {
      if (activeContainers[lab.id]) {
        const container = activeContainers[lab.id];
        const timeSpent = Date.now() - container.startTime;
        
        // Update progress
        if (userProgress[lab.id]) {
          userProgress[lab.id].timeSpent += timeSpent;
        }
        
        delete activeContainers[lab.id];
        toast.info(`🛑 ${lab.name} stopped`);
        return true;
      }
      return false;
    },

    getLabStatus: async (labId) => {
      return activeContainers[labId] || null;
    },

    // Progress & Achievement System
    submitFlag: async (labId, flag) => {
      const lab = labs.find(l => l.id === labId);
      if (!lab) throw new Error('Lab not found');

      const isCorrect = lab.flags.includes(flag);
      
      if (isCorrect) {
        // Update progress
        if (!userProgress[labId]) {
          userProgress[labId] = { progress: 0, timeSpent: 0 };
        }
        
        userProgress[labId].progress += 33.33; // Each flag is worth ~33.33%
        
        if (userProgress[labId].progress >= 100) {
          userProgress[labId].completed = true;
          userProgress[labId].completedAt = Date.now();
          
          // Award XP
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          user.xp += lab.xpReward;
          localStorage.setItem('user', JSON.stringify(user));
          
          toast.success(`🎉 Lab completed! +${lab.xpReward} XP earned!`);
        } else {
          toast.success(`✅ Flag correct! Progress: ${Math.round(userProgress[labId].progress)}%`);
        }
        
        return { correct: true, progress: userProgress[labId].progress };
      } else {
        toast.error('❌ Incorrect flag. Try again!');
        return { correct: false, progress: userProgress[labId]?.progress || 0 };
      }
    },

    getUserProgress: async () => {
      return userProgress;
    },

    // Learning Paths & Recommendations
    getLearningPaths: async () => {
      return [
        {
          id: 1,
          name: 'Web Security Fundamentals',
          description: 'Master the basics of web application security',
          difficulty: 'Beginner',
          labs: [1, 2],
          estimatedTime: '6-9 hours',
          xpReward: 450
        },
        {
          id: 2,
          name: 'Penetration Testing Pro',
          description: 'Advanced penetration testing techniques',
          difficulty: 'Advanced',
          labs: [3, 4],
          estimatedTime: '14-20 hours',
          xpReward: 1300
        }
      ];
    },

    getRecommendedLabs: async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const completedLabs = Object.keys(userProgress).filter(id => userProgress[id].completed);
      
      return labs.filter(lab => 
        !completedLabs.includes(lab.id.toString()) &&
        lab.prerequisites.every(prereq => completedLabs.includes(prereq.toString()))
      );
    },

    // Community & Social Features
    getLeaderboard: async () => {
      return users
        .map(user => ({
          ...user,
          completedLabs: Object.values(userProgress).filter(p => p.completed).length
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10);
    },

    // Analytics & Insights
    getAnalytics: async () => {
      const totalLabs = labs.length;
      const completedLabs = Object.values(userProgress).filter(p => p.completed).length;
      const totalTime = Object.values(userProgress).reduce((sum, p) => sum + p.timeSpent, 0);
      const averageTime = completedLabs > 0 ? totalTime / completedLabs : 0;
      
      return {
        totalLabs,
        completedLabs,
        completionRate: (completedLabs / totalLabs) * 100,
        totalTime,
        averageTime,
        currentStreak: 3, // Simulated
        weeklyProgress: 75 // Simulated
      };
    },

    // Real-time Features
    subscribeToLabUpdates: (labId, callback) => {
      // Simulate real-time updates
      const interval = setInterval(() => {
        if (activeContainers[labId]) {
          callback(activeContainers[labId]);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  };
};
  