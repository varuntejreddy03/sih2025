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
  const [showContentModal, setShowContentModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

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
        // Success handled silently
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

  const viewGeneratedContent = async (selection) => {
    try {
      const response = await fetch(getApiUrl(`/api/content/${selection.ps_id}/${selection.team_id}`));
      if (response.ok) {
        const content = await response.json();
        setGeneratedContent(formatSIHContent(content));
        setShowContentModal(true);
      } else {
        setGeneratedContent('Content not found. Please generate PPT first.');
        setShowContentModal(true);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setGeneratedContent('Error loading content. Please try again.');
      setShowContentModal(true);
    }
  };

  const formatSIHContent = (content) => {
    if (typeof content === 'string') return content;
    
    let formatted = '🏆 SIH 2025 WINNER FORMAT CONTENT\n';
    formatted += '=' .repeat(50) + '\n\n';
    
    if (content.summary) {
      formatted += 'SLIDE 2 - PROBLEM & SOLUTION:\n';
      formatted += content.summary + '\n\n';
    }
    
    if (content.technicalApproach) {
      formatted += 'SLIDE 3 - TECHNICAL APPROACH:\n';
      formatted += content.technicalApproach + '\n\n';
    }
    
    if (content.feasibility) {
      formatted += 'SLIDE 4 - FEASIBILITY & RISKS:\n';
      formatted += content.feasibility + '\n\n';
    }
    
    if (content.impact) {
      formatted += 'SLIDE 5 - IMPACT & BENEFITS:\n';
      formatted += content.impact + '\n\n';
    }
    
    if (content.references) {
      formatted += 'SLIDE 6 - RESEARCH & REFERENCES:\n';
      content.references.forEach((ref, i) => {
        formatted += `• ${ref}\n`;
      });
    }
    
    return formatted;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
                ✨ SIH 2025 PREMIUM
              </h1>
              <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-6">
                AI-Powered Winner Platform • Official 6-Slide Format • Premium Mentor Guidance
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => setShowGuide(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  📚 How to Use Guide
                </Button>
                <Button
                  onClick={() => { setShowSelections(!showSelections); loadSelections(); }}
                  variant={showSelections ? "default" : "outline"}
                  className={showSelections ? "bg-white/20 text-white border-white/30" : "border-white/30 text-white hover:bg-white/10"}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showSelections ? 'Hide' : 'My'} Selections
                </Button>
                <Button
                  onClick={() => setShowProfile(true)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  Team Profile
                </Button>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Premium Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                <Input
                  placeholder="🔍 Search 135+ SIH problems..."
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="" className="bg-slate-800">🎯 All Themes</option>
                {themes.map(theme => (
                  <option key={theme} value={theme} className="bg-slate-800">{theme.length > 25 ? theme.substring(0, 25) + '...' : theme}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <select
                  className="flex-1 h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" className="bg-slate-800">📂 All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-slate-800">{category}</option>
                  ))}
                </select>

                <Button 
                  onClick={clearFilters} 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 rounded-xl"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Premium Selections Display */}
        <AnimatePresence>
          {showSelections && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  🏆 Your Premium Selections ({selections.length})
                </h2>
                {selections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 text-lg">No selections yet. Choose a problem to generate premium content!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selections.map((selection, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-base mb-2">{selection.ps_title}</h3>
                            <div className="flex gap-4 text-sm text-white/60">
                              <span>🎯 PS ID: {selection.ps_id}</span>
                              <span>👥 Team: {selection.team_id}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => viewGeneratedContent(selection)}
                              size="sm"
                              className="bg-blue-500/80 hover:bg-blue-600 text-white border-0"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Content
                            </Button>
                            <Button
                              onClick={() => downloadPPT(selection)}
                              size="sm"
                              className="bg-green-500/80 hover:bg-green-600 text-white border-0"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <span className="px-3 py-1 bg-emerald-500/80 text-white text-xs rounded-full font-medium">
                              ✓ {selection.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
            <p className="text-white/90 font-medium">
              ✨ Showing <span className="text-yellow-400 font-bold">{filteredProblems.length}</span> of <span className="text-yellow-400 font-bold">{problems.length}</span> premium problem statements
            </p>
          </div>
        </motion.div>

        {/* Problem Cards Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.ps_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="h-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">
                      {problem.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
                        {problem.theme.length > 20 ? problem.theme.substring(0, 20) + '...' : problem.theme}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white text-xs rounded-full font-medium backdrop-blur-sm">
                        {problem.category}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                      {problem.description.substring(0, 150)}...
                    </p>
                  </div>
                  <Button
                    onClick={() => handleSelectProblem(problem)}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    ✨ Generate Premium PPT
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Modal */}
        <AnimatePresence>
          {showModal && selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900/95 backdrop-blur-lg border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ✨ Premium PPT Generator
                    </h2>
                    <Button
                      onClick={() => setShowModal(false)}
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mb-6 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                      🏆 Premium Problem Selected:
                    </h3>
                    <p className="text-white/90 mb-4 leading-relaxed font-medium">{selectedProblem.title}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full font-semibold shadow-lg">
                        {selectedProblem.theme.length > 25 ? selectedProblem.theme.substring(0, 25) + '...' : selectedProblem.theme}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full font-semibold shadow-lg">
                        {selectedProblem.category}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm rounded-full font-semibold shadow-lg">
                        ✨ Premium
                      </span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      💡 Your Solution Idea (Optional)
                    </label>
                    <textarea
                      className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Describe your innovative solution or leave empty for AI to generate premium SIH-compliant content..."
                      value={ideaDraft}
                      onChange={(e) => setIdeaDraft(e.target.value)}
                    />
                    <div className="mt-3 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                      <p className="text-sm text-white/90">
                        ✨ <strong>Premium AI Mentor</strong> generates official 6-slide SIH format with bullet points, architecture diagrams, and comprehensive judge preparation
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGeneratePPT}
                      disabled={isGeneratingPPT}
                      className="flex-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      {isGeneratingPPT ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Generating Premium Content...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          <span>✨ Generate Premium SIH PPT</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Content View Modal */}
        <AnimatePresence>
          {showContentModal && generatedContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900/95 backdrop-blur-lg border border-purple-500/30 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto mx-4 shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
                      📝 Premium Generated Content
                    </h2>
                    <Button
                      onClick={() => setShowContentModal(false)}
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="max-w-none">
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto border border-white/10">
                      <pre className="whitespace-pre-wrap text-sm text-green-300 font-mono leading-relaxed">{generatedContent}</pre>
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                      <p className="text-white/90 leading-relaxed">
                        ✨ <strong>Premium SIH Guidelines:</strong> This content follows official SIH winner format. Use with the provided Google Slides template - replace template text with these bullet points while preserving the visual design and layout.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guide Modal */}
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900/95 backdrop-blur-lg border border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4 shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                      📚 How to Use SIH Premium Platform
                    </h2>
                    <Button
                      onClick={() => setShowGuide(false)}
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="space-y-6 text-white">
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-400/30">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        🚀 Step 1: Browse & Search
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        Use the premium search to explore 135+ SIH problem statements. Filter by themes like HealthTech, AgriTech, etc. Each problem card shows the theme, category, and description.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-400/30">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        ✨ Step 2: Generate Premium PPT
                      </h3>
                      <p className="text-white/80 leading-relaxed mb-3">
                        Click "Generate Premium PPT" on any problem. Our AI Mentor creates SIH-compliant presentations with:
                      </p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                        <li>Official 6-slide format (Problem, Solution, Technical, Feasibility, Impact, Research)</li>
                        <li>Bullet points only - no paragraphs</li>
                        <li>Architecture diagrams and visual suggestions</li>
                        <li>Judge Q&A preparation</li>
                        <li>Scoring optimization (9-10 range)</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-400/30">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        💾 Step 3: Download & Use
                      </h3>
                      <p className="text-white/80 leading-relaxed mb-3">
                        After generation, view your selections and download the content. The downloaded file contains:
                      </p>
                      <ul className="list-disc list-inside text-white/70 space-y-1 ml-4">
                        <li>Complete 6-slide content in SIH winner format</li>
                        <li>Google Slides template link</li>
                        <li>Architecture diagram prompts for AI tools</li>
                        <li>Presentation tips and judge preparation</li>
                        <li>Scoring analysis and recommendations</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-2xl border border-orange-400/30">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        🏆 Step 4: SIH Success Tips
                      </h3>
                      <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                        <li><strong>Follow the 6-slide rule:</strong> Never exceed 6 slides as per SIH guidelines</li>
                        <li><strong>Use bullet points only:</strong> No paragraphs or long text blocks</li>
                        <li><strong>Add visuals:</strong> Include diagrams, flowcharts, and mockups</li>
                        <li><strong>Practice presentation:</strong> 3 minutes total (30 seconds per slide)</li>
                        <li><strong>Highlight uniqueness:</strong> What makes your solution novel?</li>
                        <li><strong>Prepare for questions:</strong> Use our generated Q&A section</li>
                      </ul>
                    </div>

                    <div className="text-center pt-4">
                      <Button
                        onClick={() => setShowGuide(false)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-bold"
                      >
                        🚀 Start Creating Premium PPTs
                      </Button>
                    </div>
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