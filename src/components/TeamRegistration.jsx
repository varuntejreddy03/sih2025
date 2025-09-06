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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Team Registration
            </h1>
            <p className="text-gray-600">
              Register your team for Smart India Hackathon 2025
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm mb-6 ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.includes('successfully') && <CheckCircle className="inline h-4 w-4 mr-2" />}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team ID *
                </label>
                <input
                  type="text"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleInputChange}
                  placeholder="e.g., TEAM001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="team_name"
                  value={formData.team_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Innovators"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Email *
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                placeholder="team.leader@college.edu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Password will be sent to this email address
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Team Members (Add at least 6 members)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.members.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={`Member ${index + 1} name`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter names of team members. Minimum 6 members required.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Team...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Register Team
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