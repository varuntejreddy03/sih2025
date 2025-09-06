import React, { useState, useEffect } from 'react';
import ProblemBrowserEnhanced from './components/ProblemBrowserEnhanced';
import CollegeAdmin from './components/CollegeAdmin';
import TeamRegistration from './components/TeamRegistration';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import LandingPage from './components/LandingPage';
import MandatoryPasswordChange from './components/MandatoryPasswordChange';
import { Users, Settings, Home, LogIn, LogOut } from 'lucide-react';
import { getApiUrl } from './config';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [loggedInTeam, setLoggedInTeam] = useState(null);
  const [loggedInAdmin, setLoggedInAdmin] = useState(null);
  const [registeredTeam, setRegisteredTeam] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname === '/admin');
    
    // Restore session from localStorage on page load
    const savedTeam = localStorage.getItem('loggedInTeam');
    const savedAdmin = localStorage.getItem('loggedInAdmin');
    
    if (savedTeam) {
      try {
        const teamData = JSON.parse(savedTeam);
        setLoggedInTeam(teamData);
        setActiveTab('browse');
      } catch (error) {
        console.error('Error parsing saved team data:', error);
        localStorage.removeItem('loggedInTeam');
      }
    }
    
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setLoggedInAdmin(adminData);
        setActiveTab('admin');
      } catch (error) {
        console.error('Error parsing saved admin data:', error);
        localStorage.removeItem('loggedInAdmin');
      }
    }
  }, []);

  const handleRegistrationSuccess = (teamId, message) => {
    setRegisteredTeam({ id: teamId, message: message });
    setActiveTab('login');
  };

  const handleLoginSuccess = (teamId, teamName, isDefaultPassword = false) => {
    console.log('Login success:', { teamId, teamName, isDefaultPassword });
    const teamData = { team_id: teamId, team_name: teamName, is_default_password: isDefaultPassword };
    setLoggedInTeam(teamData);
    localStorage.setItem('loggedInTeam', JSON.stringify(teamData));
    
    if (isDefaultPassword) {
      setActiveTab('change-password');
    } else {
      setActiveTab('browse');
    }
  };

  const handleMandatoryPasswordChanged = () => {
    const savedTeam = localStorage.getItem('loggedInTeam');
    if (savedTeam) {
      try {
        const teamData = JSON.parse(savedTeam);
        teamData.is_default_password = false;
        setLoggedInTeam(teamData);
        localStorage.setItem('loggedInTeam', JSON.stringify(teamData));
      } catch (error) {
        console.error('Error updating team data:', error);
      }
    }
    setActiveTab('browse');
  };

  const handleAdminLogin = () => {
    const adminData = { username: 'admin' };
    setLoggedInAdmin(adminData);
    localStorage.setItem('loggedInAdmin', JSON.stringify(adminData));
    setActiveTab('admin');
  };

  const handleLogout = async () => {
    if (loggedInTeam) {
      try {
        await fetch(getApiUrl('/api/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ team_id: loggedInTeam.team_id }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear session data
    localStorage.removeItem('loggedInTeam');
    localStorage.removeItem('loggedInAdmin');
    
    setLoggedInTeam(null);
    setLoggedInAdmin(null);
    setActiveTab('login');
  };

  // Show admin login for /admin route
  if (isAdminRoute && !loggedInAdmin) {
    return <AdminLogin onAdminLogin={handleAdminLogin} />;
  }

  // Show mandatory password change for default passwords
  if (loggedInTeam && activeTab === 'change-password') {
    return (
      <MandatoryPasswordChange
        teamId={loggedInTeam.team_id}
        teamName={loggedInTeam.team_name}
        onPasswordChanged={handleMandatoryPasswordChanged}
      />
    );
  }

  // Show landing page if not authenticated
  if (!loggedInTeam && !loggedInAdmin && activeTab === 'landing') {
    return <LandingPage onGetStarted={() => setActiveTab('login')} />;
  }

  // Show login/register screens
  if (!loggedInTeam && !loggedInAdmin && (activeTab === 'login' || activeTab === 'register')) {
    return (
      <div className="App min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button 
                  onClick={() => setActiveTab('landing')}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  College SIH Platform 2025
                </button>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'register'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Register Team
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'login'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-6">
          {activeTab === 'register' && (
            <div>
              <TeamRegistration onRegistrationSuccess={handleRegistrationSuccess} />
              {registeredTeam && (
                <div className="max-w-2xl mx-auto mt-4">
                  <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    ✅ {registeredTeam.message || `Team ${registeredTeam.id} registered successfully!`}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'login' && (
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">College SIH Platform 2025</h1>
              {loggedInTeam && (
                <span className="ml-4 text-sm text-green-600 font-medium">
                  Welcome, {loggedInTeam.team_name} ({loggedInTeam.team_id})
                </span>
              )}
              {loggedInAdmin && (
                <span className="ml-4 text-sm text-red-600 font-medium">
                  Admin: {loggedInAdmin.username}
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              {!loggedInTeam && !loggedInAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('register')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'register'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Register Team
                  </button>
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'login'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button>
                </>
              )}
              {loggedInTeam && (
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'browse'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Browse Problems
                </button>
              )}
              {loggedInAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </button>
              )}
              {(loggedInTeam || loggedInAdmin) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-6">
        {activeTab === 'register' && (
          <div>
            <TeamRegistration onRegistrationSuccess={handleRegistrationSuccess} />
            {registeredTeam && (
              <div className="max-w-2xl mx-auto mt-4">
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ✅ {registeredTeam.message || `Team ${registeredTeam.id} registered successfully!`}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'login' && (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setActiveTab('register')}
          />
        )}
        {activeTab === 'browse' && loggedInTeam && (
          <ProblemBrowserEnhanced teamId={loggedInTeam.team_id} />
        )}
        {activeTab === 'admin' && loggedInAdmin && (
          <CollegeAdmin />
        )}
      </main>
    </div>
  );
}

export default App;