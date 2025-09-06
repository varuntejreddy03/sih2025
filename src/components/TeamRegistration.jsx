import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, User, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const TeamRegistration = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    team_id: '',
    team_name: '',
    contact_email: '',
    members: ['', '', '', '', '', ''] // 6 members max
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData(prev => ({
      ...prev,
      members: newMembers
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate minimum 6 members
    const validMembers = formData.members.filter(member => member.trim() !== '');
    if (validMembers.length < 6) {
      setMessage('Please add at least 6 team members.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://sihpro.onrender.com/api/register_team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          members: validMembers
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message + (result.password ? ` Password: ${result.password}` : ''));
        if (onRegistrationSuccess) {
          onRegistrationSuccess(formData.team_id, result.message);
        }
        // Reset form
        setFormData({
          team_id: '',
          team_name: '',
          contact_email: '',
          members: ['', '', '', '', '', '']
        });
      } else {
        setMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">
                ✨ Premium Registration
              </h1>
              <p className="text-white/80 text-lg">
                Join the elite SIH 2025 Premium Platform
              </p>
            </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm mb-6 backdrop-blur-sm ${
              message.includes('successfully') 
                ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                : 'bg-red-500/20 border border-red-400/30 text-red-300'
            }`}>
              {message.includes('successfully') && <CheckCircle className="inline h-4 w-4 mr-2" />}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  🎯 Premium Team ID *
                </label>
                <input
                  type="text"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleInputChange}
                  placeholder="e.g., PREMIUM_TEAM_001"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  ✨ Team Name *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Elite Tech Innovators"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-400" />
                📧 Premium Contact Email *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="premium.team@college.edu"
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                required
              />
              <p className="text-sm text-white/60 mt-2">
                🔑 Premium credentials will be sent to this email
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                👥 Premium Team Members (Minimum 6 required)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={`✨ Premium Member ${index + 1}`}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  />
                ))}
              </div>
              <p className="text-sm text-white/60 mt-3">
                🏆 Enter names of your elite team members. Minimum 6 required for premium access.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Premium Account...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-5 w-5" />
                  ✨ Join Premium Platform
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamRegistration;