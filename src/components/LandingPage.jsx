import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, Target, ArrowRight, Star, Award, Rocket } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SIH 2025</h1>
                <p className="text-sm text-gray-300">AI Platform</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
            >
              Get Started
            </motion.button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container mx-auto px-6 py-20 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-medium">Smart India Hackathon 2025</span>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
          >
            SIH Content
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Platform
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Generate winning presentations with AI research, smart scoring, and comprehensive content. 
            Built for SIH 2025 teams to create professional submissions that impress judges.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl flex items-center space-x-3"
            >
              <Rocket className="h-6 w-6" />
              <span>Start Building</span>
              <ArrowRight className="h-6 w-6" />
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-gray-300"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm">Join teams already using our platform</span>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create winning SIH presentations with AI-powered tools and expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8" />,
                title: "AI-Powered Research",
                description: "Advanced AI models generate comprehensive research, technical approaches, and implementation strategies tailored to your problem statement.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Smart Scoring System",
                description: "Intelligent evaluation system rates your ideas on novelty, feasibility, and impact with optimized scoring for SIH success.",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Winner Format Compliance",
                description: "Follows official SIH 2025 guidelines with 6-slide format, bullet points only, and judge-ready presentation structure.",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>



        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="container mx-auto px-6 py-20 text-center"
        >
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Win SIH 2025?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join teams already using our AI-powered platform to create winning presentations.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl"
            >
              Get Started Now - It's Free!
            </motion.button>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="container mx-auto px-6 py-12 text-center border-t border-white/10"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SIH 2025 AI Platform</span>
          </div>
          <p className="text-gray-400">
            Built for Smart India Hackathon 2025 • Empowering Innovation • Creating Winners
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;