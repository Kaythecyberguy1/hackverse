import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth.js';
import { db } from '../services/database.js';
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  ArrowLeft,
  Shield,
  Trophy,
  Target,
  BookOpen,
  Zap,
  TrendingUp,
  Award,
  Edit3
} from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.checkAuth()) {
          navigate('/login');
          return;
        }

        const user = await auth.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setCurrentUser(user);
        setFormData({
          username: user.username || '',
          email: user.email || '',
          avatar: user.avatar || '👤'
        });

        // Load user progress
        const progress = await db.getUserProgress(user.id);
        setUserProgress(progress);

        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (newAvatar) => {
    setFormData({
      ...formData,
      avatar: newAvatar
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updatedUser = await auth.updateProfile(currentUser.id, formData);
      setCurrentUser(updatedUser);
      setEditing(false);
      setMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const avatarOptions = ['👤', '🦹‍♂️', '🥷', '🦊', '🐱', '🐺', '🦁', '🐯', '🐸', '🐙', '🦄', '🌟'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-6xl mb-4 border-4 border-gray-800">
                    {formData.avatar}
                  </div>
                  {editing && (
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{currentUser.username}</h2>
                <div className="text-cyan-400 font-medium mb-1">{currentUser.rank}</div>
                <div className="text-gray-400 text-sm">Level {currentUser.level}</div>
              </div>

              {/* Avatar Selection */}
              {editing && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">Choose Avatar</label>
                  <div className="grid grid-cols-6 gap-2">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarChange(avatar)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                          formData.avatar === avatar
                            ? 'bg-cyan-500 border-2 border-cyan-400'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Total XP</span>
                  </div>
                  <span className="text-white font-semibold">{currentUser.xp?.toLocaleString() || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Labs Completed</span>
                  </div>
                  <span className="text-white font-semibold">{currentUser.totalLabsCompleted || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Challenges Solved</span>
                  </div>
                  <span className="text-white font-semibold">{currentUser.totalChallengesSolved || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                    <span className="text-gray-300">Current Streak</span>
                  </div>
                  <span className="text-white font-semibold">{currentUser.streak || 0} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form & Achievements */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Form */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Profile Information</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {editing ? (
                    <>
                      <Shield className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className={`p-4 rounded-lg mb-6 ${
                  message.includes('successfully') 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            {currentUser.achievements && currentUser.achievements.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{achievement}</div>
                        <div className="text-gray-400 text-sm">Unlocked!</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Member Since</label>
                  <p className="text-white">{currentUser.joinDate || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Active</label>
                  <p className="text-white">{currentUser.lastActive || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Account Status</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentUser.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className="text-white">{currentUser.isVerified ? 'Verified' : 'Pending Verification'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                  <p className="text-white capitalize">{currentUser.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
