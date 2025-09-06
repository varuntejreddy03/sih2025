import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Download, Eye, EyeOff, User, Zap, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import TeamProfile from './TeamProfile';
import { getApiUrl } from '../config';

const ProblemBrowserEnhanced = ({ teamId: propTeamId }) => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [ideaDraft, setIdeaDraft] = useState('');
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [selections, setSelections] = useState([]);
  const [showSelections, setShowSelections] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [teamId, setTeamId] = useState(propTeamId || 'TEAM001');

  useEffect(() => {
    if (propTeamId) {
      setTeamId(propTeamId);
    }
  }, [propTeamId]);

  // Load problems from JSON file
  useEffect(() => {
    fetch(getApiUrl('/api/problems'))
      .then(response => response.json())
      .then(data => {
        setProblems(data);
        setFilteredProblems(data);
      })
      .catch(error => console.error('Error loading problems:', error));
  }, []);

  // Load selections for this team only
  const loadSelections = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/dashboard/${teamId}`));
      const data = await response.json();
      setSelections(data);
    } catch (error) {
      console.error('Error loading selections:', error);
    }
  };

  const downloadPPT = async (selection) => {
    try {
      const response = await fetch(getApiUrl('/download_ppt'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ps_id: selection.ps_id,
          team_id: selection.team_id,
          title: selection.ps_title
        })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SIH2025_Winner_Content_${selection.team_id}_${selection.ps_id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('🏆 ENHANCED SIH content downloaded!\\n📋 Google Slides template instructions included\\n🎯 Architecture diagram prompts for AI tools\\n📊 Ready for Google Slides integration');
      } else {
        const errorData = await response.json();
        alert(`Download failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`Error downloading PPT: ${error.message}`);
    }
  };

  // Filter problems based on search and filters
  useEffect(() => {
    let filtered = problems.filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           problem.theme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme = !selectedTheme || problem.theme === selectedTheme;
      const matchesCategory = !selectedCategory || problem.category === selectedCategory;
      
      return matchesSearch && matchesTheme && matchesCategory;
    });
    setFilteredProblems(filtered);
  }, [problems, searchTerm, selectedTheme, selectedCategory]);

  // Get unique values for filters
  const themes = [...new Set(problems.map(p => p.theme))];
  const categories = [...new Set(problems.map(p => p.category))];

  const handleSelectProblem = (problem) => {
    setSelectedProblem(problem);
    setShowModal(true);
    setIdeaDraft('');
  };

  const handleGeneratePPT = async () => {
    setIsGeneratingPPT(true);
    
    let finalIdea = ideaDraft.trim();
    if (!finalIdea) {
      finalIdea = 'Generate comprehensive AI-powered solution';
    }
    
    try {
      const pptResponse = await fetch(getApiUrl('/generate_ppt'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ps_id: selectedProblem.ps_id,
          title: selectedProblem.title,
          idea: finalIdea,
          team_id: teamId,
          student_name: 'Team Member'
        })
      });

      if (pptResponse.ok) {
        const result = await pptResponse.json();
        
        await fetch(getApiUrl('/api/save_selection'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: 'Team Member',
            team_id: teamId,
            ps_id: selectedProblem.ps_id,
            idea: finalIdea
          })
        });

        const scoreMsg = result.scores ? `\\n🏆 AI Scores - Novelty: ${result.scores.novelty}/10, Feasibility: ${result.scores.feasibility}/10, Impact: ${result.scores.impact}/10` : '';
        alert(`✅ ${result.message || 'SIH Content generated successfully'} and selection saved!${scoreMsg}\\n\\n🔗 Use Google Slides template for final presentation`);
        setShowModal(false);
        loadSelections();
      } else {
        const error = await pptResponse.json();
        alert(`❌ Error: ${error.error || 'Failed to generate PPT'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating PPT');
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTheme('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              🚀 SIH 2025 Problem Browser
            </h1>
            <p className="text-gray-600">Generate comprehensive content for Google Slides template with AI research</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => { setShowSelections(!showSelections); loadSelections(); }}
              variant={showSelections ? "default" : "outline"}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              {showSelections ? 'Hide Selections' : 'View Selections'}
            </Button>
            <Button
              onClick={() => setShowProfile(true)}
              variant="outline"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Team Profile
            </Button>
          </div>
        </motion.div>



        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search problems, themes, organizations..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                >
                  <option value="">All Themes</option>
                  {themes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <Button onClick={clearFilters} variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>



        {/* Selections Display */}
        <AnimatePresence>
          {showSelections && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Your Selections ({selections.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selections.length === 0 ? (
                    <p className="text-gray-500">No selections yet. Select a problem to get started!</p>
                  ) : (
                    <div className="space-y-3">
                      {selections.map((selection, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{selection.ps_title}</h3>
                              <p className="text-sm text-gray-600">PS ID: {selection.ps_id}</p>
                              <p className="text-sm text-gray-600">Team: {selection.team_id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => downloadPPT(selection)}
                                size="sm"
                                className="gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download Content
                              </Button>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                {selection.status}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <p className="text-gray-600">
            Showing {filteredProblems.length} of {problems.length} problem statements
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.ps_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {problem.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {problem.theme}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {problem.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {problem.description.substring(0, 150)}...
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSelectProblem(problem)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Select Problem
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Enter Your Idea Draft
                    </h2>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="ghost"
                      size="icon"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Selected Problem:</h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedProblem.title}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {selectedProblem.theme}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {selectedProblem.category}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Idea Draft (Optional - AI will enhance or generate if empty)
                    </label>
                    <textarea
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave empty for AI to generate a comprehensive solution, or add your own ideas for AI enhancement..."
                      value={ideaDraft}
                      onChange={(e) => setIdeaDraft(e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      🚀 AI will generate comprehensive content for Google Slides template with diagram prompts and quality evaluation
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGeneratePPT}
                      disabled={isGeneratingPPT}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 gap-2"
                    >
                      {isGeneratingPPT ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Generate SIH Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Profile Modal */}
        {showProfile && (
          <TeamProfile 
            teamId={teamId} 
            onClose={() => setShowProfile(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default ProblemBrowserEnhanced;