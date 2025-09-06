import React, { useState, useEffect } from 'react';
import { Users, Download, BarChart3, Trophy, Clock, Target } from 'lucide-react';

const CollegeAdmin = () => {
  const [teams, setTeams] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchAnalytics();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/admin/dashboard');
      const data = await response.json();
      setTeams(data.teams);
      setStatistics(data.statistics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/analytics/performance');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const exportAllTeams = () => {
    window.open('http://localhost:5001/api/export/all_teams', '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">🏆 SIH 2025 Admin Dashboard</h1>
          <p className="text-red-100 text-lg">Monitor and manage all teams for Smart India Hackathon 2025</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.totalTeams || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.totalSubmissions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {statistics.avgScores ? 
                  ((statistics.avgScores.novelty + statistics.avgScores.feasibility + statistics.avgScores.impact) / 3).toFixed(1) 
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Teams</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.totalTeams || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={exportAllTeams}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Download className="h-5 w-5" />
          📊 Export All Teams Data
        </button>
      </div>

      {/* Theme Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Theme-wise Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.map((theme, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{theme.theme}</h3>
              <div className="space-y-1 text-sm">
                <p>Teams: <span className="font-medium">{theme.team_count}</span></p>
                <p>Avg Novelty: <span className="font-medium">{(theme.avg_novelty || 0).toFixed(1)}</span></p>
                <p>Avg Feasibility: <span className="font-medium">{(theme.avg_feasibility || 0).toFixed(1)}</span></p>
                <p>Avg Impact: <span className="font-medium">{(theme.avg_impact || 0).toFixed(1)}</span></p>
                <p>Highest Total: <span className="font-medium text-green-600">{theme.highest_total || 0}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teams List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Teams</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem Statement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.team_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.student_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {team.ps_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {team.theme}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.novelty_score && team.feasibility_score && team.impact_score ? (
                      <div className="flex space-x-1">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          N:{team.novelty_score}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          F:{team.feasibility_score}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          I:{team.impact_score}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not scored</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(team.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdmin;