import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ChangePassword = ({ teamId, onPasswordChanged, onCancel }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.new_password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://sihpro.onrender.com/api/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: teamId,
          current_password: formData.current_password,
          new_password: formData.new_password
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onPasswordChanged();
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              🔒 Premium Security
            </h2>
            <p className="text-white/80 mt-2">Set your premium secure password</p>
          </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              🔑 Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="current_password"
                value={formData.current_password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 backdrop-blur-sm"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-4 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              ✨ New Premium Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="new_password"
                value={formData.new_password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 backdrop-blur-sm"
                placeholder="Create secure password (min 6 chars)"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-4 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              🔒 Confirm Premium Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 backdrop-blur-sm"
                placeholder="Confirm your secure password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-4 text-white/60 hover:text-white transition-colors"
              >
                {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? '🔄 Updating...' : '✨ Secure Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;