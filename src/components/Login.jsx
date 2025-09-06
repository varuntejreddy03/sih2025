import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { getApiUrl } from '../config';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    team_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setResetSuccess('');
  };

  const handleResetPassword = async () => {
    if (!formData.team_id) {
      setError('Please enter your Team ID first');
      return;
    }
    
    setResetLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('/api/reset_password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: formData.team_id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setResetSuccess(result.message);
        setShowResetPassword(false);
      } else {
        setError(result.error || 'Password reset failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onLoginSuccess(result.team_id, result.team_name, result.is_default_password);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
                ✨ Premium Login
              </h1>
              <p className="text-white/80 text-lg">
                Access your SIH 2025 Premium Platform
              </p>
            </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Team ID
              </label>
              <input
                type="text"
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
                placeholder="Enter your premium team ID"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-400" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your secure password"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Accessing Premium...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  ✨ Access Premium Platform
                </>
              )}
            </button>
          </form>

          {resetSuccess && (
            <div className="bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-3 rounded-xl text-sm text-center backdrop-blur-sm mt-4">
              {resetSuccess}
            </div>
          )}

          <div className="space-y-4 mt-8">
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="text-sm text-purple-300 hover:text-purple-200 font-medium hover:underline transition-colors"
              >
                🔑 Forgot Password?
              </button>
            </div>
            
            {showResetPassword && (
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-white/80 mb-3">
                  Enter your Team ID and we'll send a new password to your registered email.
                </p>
                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading || !formData.team_id}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset...
                    </>
                  ) : (
                    '📧 Reset Password'
                  )}
                </button>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-white/70">
                New to premium platform?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-yellow-400 font-semibold hover:text-yellow-300 hover:underline transition-colors"
                >
                  ✨ Register Premium Team
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;