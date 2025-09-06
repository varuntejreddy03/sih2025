import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Mail, Calendar, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const TeamProfile = ({ teamId, onClose }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamProfile = async () => {
      try {
        const response = await fetch(`https://sihpro.onrender.com/api/team/profile/${teamId}`);
        if (response.ok) {
          const data = await response.json();
          setTeamData(data);
        }
      } catch (error) {
        console.error('Error fetching team profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamProfile();
    }
  }, [teamId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Loading team profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p>Team profile not found</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Profile
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Team ID</label>
                <p className="text-lg font-semibold">{teamData.team_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Team Name</label>
                <p className="text-lg font-semibold">{teamData.team_name}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Contact Email
              </label>
              <p className="text-gray-900">{teamData.contact_email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Registration Date
              </label>
              <p className="text-gray-900">
                {new Date(teamData.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3">
                <User className="h-4 w-4" />
                Team Members ({teamData.members.length})
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {teamData.members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-900">{member}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeamProfile;