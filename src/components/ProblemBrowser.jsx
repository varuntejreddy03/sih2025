import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ChangePassword from './ChangePassword';
import PasswordChangePrompt from './PasswordChangePrompt';

const ProblemBrowser = ({ teamId: propTeamId }) => {
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
  const [showSPOCDashboard, setShowSPOCDashboard] = useState(false);
  const [spocData, setSPOCData] = useState([]);
  const [studentName, setStudentName] = useState('Student User');
  const [teamId, setTeamId] = useState(propTeamId || 'TEAM001');

  // Update teamId when prop changes
  useEffect(() => {
    if (propTeamId) {
      setTeamId(propTeamId);
    }
  }, [propTeamId]);
  const [showEvaluator, setShowEvaluator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');
  const [enhancementResult, setEnhancementResult] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);

  // Load problems from JSON file
  useEffect(() => {
    fetch('https://sihpro.onrender.com/api/problems')
      .then(response => response.json())
      .then(data => {
        setProblems(data);
        setFilteredProblems(data);
      })
      .catch(error => console.error('Error loading problems:', error));
  }, []);

  // Load selections
  const loadSelections = async () => {
    try {
      const response = await fetch(`https://sihpro.onrender.com/api/dashboard/${teamId}`);
      if (response.ok) {
        const data = await response.json();
        setSelections(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to load selections:', response.status);
        setSelections([]);
      }
    } catch (error) {
      console.error('Error loading selections:', error);
      setSelections([]);
    }
  };

  // Load SPOC Dashboard
  const loadSPOCDashboard = async () => {
    try {
      const response = await fetch('https://sihpro.onrender.com/api/spoc/dashboard');
      const data = await response.json();
      setSPOCData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading SPOC dashboard:', error);
      setSPOCData([]);
    }
  };

  // Load generated content
  const loadGeneratedContent = async () => {
    try {
      const response = await fetch('https://sihpro.onrender.com/api/generated_content');
      if (response.ok) {
        const data = await response.json();
        setGeneratedContent(data);
        console.log('Generated content loaded:', data.length, 'items');
      } else {
        console.error('Failed to load generated content:', response.status);
        setGeneratedContent([]);
      }
    } catch (error) {
      console.error('Error loading generated content:', error);
      setGeneratedContent([]);
    }
  };

  // Load generated content when component mounts
  useEffect(() => {
    loadGeneratedContent();
  }, []);

  const enhanceContent = async () => {
    if (!selectedContent) {
      alert('Please select content to enhance');
      return;
    }
    
    setIsEnhancing(true);
    try {
      const response = await fetch('https://sihpro.onrender.com/enhance_content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ps_id: selectedContent
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setEnhancementResult(result);
        loadGeneratedContent(); // Refresh list
      } else {
        const error = await response.json();
        alert(`Enhancement failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      alert(`Error enhancing content: ${error.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  const downloadPPT = async (selection) => {
    try {
      const response = await fetch('https://sihpro.onrender.com/download_ppt', {
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
        alert('🏆 ENHANCED SIH content downloaded!\n📋 Google Slides template instructions included\n🎯 Architecture diagram prompts for AI tools\n📊 Ready for Google Slides integration');
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
    
    // Use AI to generate idea if user hasn't provided one
    let finalIdea = ideaDraft.trim();
    if (!finalIdea) {
      finalIdea = 'Generate comprehensive AI-powered solution';
    }
    
    try {
      // Generate PPT
      const pptResponse = await fetch('https://sihpro.onrender.com/generate_ppt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ps_id: selectedProblem.ps_id,
          title: selectedProblem.title,
          idea: finalIdea,
          team_id: teamId,
          student_name: studentName
        })
      });

      if (pptResponse.ok) {
        const result = await pptResponse.json();
        
        // Save selection
        await fetch('https://sihpro.onrender.com/api/save_selection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: studentName,
            team_id: teamId,
            ps_id: selectedProblem.ps_id,
            idea: finalIdea,
            timestamp: new Date().toISOString()
          })
        });

        const scoreMsg = result.scores ? `\n🏆 AI Scores - Novelty: ${result.scores.novelty}/10, Feasibility: ${result.scores.feasibility}/10, Impact: ${result.scores.impact}/10` : '';
        const featuresMsg = result.features ? `\n🚀 Features Generated:\n${result.features.aiResearch ? '✅ AI Research' : ''}\n${result.features.ideaEnhanced ? '✅ AI-Enhanced Idea' : ''}\n${result.features.diagramPrompt ? '✅ Diagram Prompt for AI Tools' : ''}\n${result.features.qualityEvaluation ? '✅ Quality Evaluation' : ''}\n${result.features.usesGoogleSlides ? '✅ Google Slides Template Ready' : ''}` : '';
        const diagramMsg = result.diagramPrompt ? '\n\n🎨 Architecture diagram prompt included for ChatGPT/Claude' : '';
        alert(`✅ ${result.message || 'SIH Content generated successfully'} and selection saved!${scoreMsg}${featuresMsg}${diagramMsg}\n\n🔗 Use Google Slides template for final presentation`);
        setShowModal(false);
        loadSelections(); // Refresh selections
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

  const handlePasswordChanged = () => {
    setShowChangePassword(false);
    setShowPasswordPrompt(false);
    setIsDefaultPassword(false);
    
    // Update localStorage
    const savedTeam = localStorage.getItem('loggedInTeam');
    if (savedTeam) {
      try {
        const teamData = JSON.parse(savedTeam);
        teamData.is_default_password = false;
        localStorage.setItem('loggedInTeam', JSON.stringify(teamData));
      } catch (error) {
        console.error('Error updating team data:', error);
      }
    }
  };

  const handleSkipPasswordChange = () => {
    setShowPasswordPrompt(false);
  };

  const handleCancelPasswordChange = () => {
    setShowChangePassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                🏆 SIH 2025 AI Platform
              </h1>
              <p className="text-teal-100 text-xl mb-6 font-medium">Generate winning presentations with AI research, smart scoring & comprehensive content</p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => { setShowSelections(!showSelections); loadSelections(); }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📊 {showSelections ? 'Hide Selections' : 'My Selections'}
                </button>
                <button
                  onClick={() => { setShowSPOCDashboard(!showSPOCDashboard); loadSPOCDashboard(); }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📈 {showSPOCDashboard ? 'Hide Analytics' : 'Analytics'}
                </button>
                <button
                  onClick={() => { setShowEvaluator(!showEvaluator); if (!showEvaluator) loadGeneratedContent(); }}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🔬 {showEvaluator ? 'Hide Enhancer' : 'AI Enhancer'}
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🔐 Change Password
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* User Details Input */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            👤 Team Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                📝 Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-6 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 bg-white shadow-md hover:shadow-lg"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                🏆 Team ID
              </label>
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-6 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 bg-blue-50 transition-all duration-300 shadow-md"
                placeholder="Team ID from login"
                readOnly={!!propTeamId}
              />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border-2 border-purple-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            🔍 Search & Filter Problems
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-6 top-5 h-6 w-6 text-purple-400" />
              <input
                type="text"
                placeholder="Search problems, themes, organizations..."
                className="w-full pl-16 pr-6 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 bg-white shadow-md hover:shadow-lg text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Theme Filter */}
            <select
              className="px-6 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 bg-white shadow-md hover:shadow-lg text-lg font-medium"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="">🎨 All Themes</option>
              {themes.map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              className="px-6 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 bg-white shadow-md hover:shadow-lg text-lg font-medium"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">📊 All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Filter className="h-5 w-5 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* SPOC Dashboard */}
        {showSPOCDashboard && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 SPOC Dashboard - Theme-wise Analytics</h2>
            {!Array.isArray(spocData) || spocData.length === 0 ? (
              <p className="text-gray-500">No data available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selections</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Novelty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Feasibility</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Impact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {spocData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.theme}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.selection_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avg_novelty ? row.avg_novelty.toFixed(1) : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avg_feasibility ? row.avg_feasibility.toFixed(1) : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avg_impact ? row.avg_impact.toFixed(1) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Content Enhancer */}
        {showEvaluator && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔬 Deep Research Content Enhancer</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select generated content to enhance with deep research:
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
              >
                <option value="">Select content to enhance...</option>
                {generatedContent.map((content, index) => (
                  <option key={index} value={content.ps_id}>
                    {content.title} - Team: {content.team_id} (Scores: {content.novelty_score || 'N/A'}/{content.feasibility_score || 'N/A'}/{content.impact_score || 'N/A'})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 mb-4">
              <button
                onClick={enhanceContent}
                disabled={isEnhancing || !selectedContent}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isEnhancing ? '🔬 Enhancing with Deep Research...' : '🔬 Enhance with Deep Research'}
              </button>
              <button
                onClick={() => { setSelectedContent(''); setEnhancementResult(null); }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
            
            {enhancementResult && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center mb-2">
                  <span className="text-lg font-bold text-blue-800">
                    ✅ CONTENT ENHANCED WITH DEEP RESEARCH
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Enhancement Results:</strong>
                  <p className="mt-1">{enhancementResult.message}</p>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">+{enhancementResult.improvement.novelty}</div>
                      <div className="text-xs">Novelty Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">+{enhancementResult.improvement.feasibility}</div>
                      <div className="text-xs">Feasibility Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">+{enhancementResult.improvement.impact}</div>
                      <div className="text-xs">Impact Improvement</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <strong>New Scores:</strong> Novelty: {enhancementResult.newScores.novelty}/10, Feasibility: {enhancementResult.newScores.feasibility}/10, Impact: {enhancementResult.newScores.impact}/10
                  </div>
                  
                  {enhancementResult.deepResearch && (
                    <div className="mt-3">
                      <strong>Deep Research Model:</strong> {enhancementResult.deepResearch.model}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selections Display */}
        {showSelections && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Selections ({selections.length})</h2>
            {selections.length === 0 ? (
              <p className="text-gray-500">No selections yet. Select a problem to get started!</p>
            ) : (
              <div className="space-y-3">
                {selections.map((selection, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{selection.ps_title}</h3>
                        <p className="text-sm text-gray-600">PS ID: {selection.ps_id}</p>
                        <p className="text-sm text-gray-600">Team: {selection.team_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadPPT(selection)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          🚀 Download Content
                        </button>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {selection.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProblems.length} of {problems.length} problem statements
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 mb-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-black">{filteredProblems.length}</div>
              <div className="text-sm font-medium opacity-90">Problems Found</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-black">{themes.length}</div>
              <div className="text-sm font-medium opacity-90">Themes Available</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-black">{categories.length}</div>
              <div className="text-sm font-medium opacity-90">Categories</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-black">135+</div>
              <div className="text-sm font-medium opacity-90">Total Problems</div>
            </div>
          </div>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProblems.map((problem, index) => {
            const cardColors = [
              'from-emerald-500 to-teal-500',
              'from-cyan-500 to-blue-500', 
              'from-violet-500 to-purple-500',
              'from-rose-500 to-pink-500',
              'from-amber-500 to-orange-500',
              'from-indigo-500 to-blue-500'
            ];
            const cardColor = cardColors[index % cardColors.length];
            
            return (
              <div key={problem.ps_id} className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-8 hover:shadow-3xl hover:scale-105 transition-all duration-500 group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${cardColor}`}></div>
                
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-black text-gray-900 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {problem.title}
                    </h3>
                    <span className={`text-xs text-white bg-gradient-to-r ${cardColor} px-3 py-2 rounded-full ml-3 flex-shrink-0 font-bold shadow-lg`}>
                      {problem.ps_id}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-sm rounded-xl font-bold border-2 border-blue-200 shadow-md">
                      🎨 {problem.theme}
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm rounded-xl font-bold border-2 border-green-200 shadow-md">
                      📊 {problem.category}
                    </span>
                  </div>

                  <p className="text-base text-gray-700 line-clamp-4 leading-relaxed font-medium">
                    {problem.description.substring(0, 180)}...
                  </p>
                </div>
                
                <button
                  onClick={() => handleSelectProblem(problem)}
                  className={`w-full bg-gradient-to-r ${cardColor} text-white py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-300 font-black text-lg shadow-xl transform hover:-translate-y-2 hover:scale-105`}
                >
                  🚀 Select & Generate AI Solution
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && selectedProblem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Enter Your Idea Draft
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
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
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGeneratePPT}
                    disabled={isGeneratingPPT}
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGeneratingPPT ? '🚀 Generating Content...' : '🚀 Generate SIH Content'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePassword && (
          <ChangePassword
            teamId={teamId}
            onPasswordChanged={handlePasswordChanged}
            onCancel={handleCancelPasswordChange}
          />
        )}
      </div>
      </div>
    </div>
  );
};

export default ProblemBrowser;