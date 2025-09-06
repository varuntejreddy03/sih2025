// Problem-specific content generation using actual problem statement data
function generateProblemSpecificContent(psTitle, psDescription, idea, aiResponse) {
  const description = psDescription || '';
  const title = psTitle || '';
  
  // Extract key information from problem description
  const requirements = extractRequirements(description);
  const stakeholders = extractStakeholders(description);
  const challenges = extractChallenges(description);
  const expectedSolution = extractExpectedSolution(description);
  
  const problemContext = {
    title: title,
    description: description,
    requirements: requirements,
    stakeholders: stakeholders,
    challenges: challenges,
    expectedSolution: expectedSolution,
    aiEnhancement: aiResponse?.generated_text || aiResponse?.summary_text || null
  };
  
  return generateContextualContent(problemContext, idea);
}

// Extract requirements from problem description
function extractRequirements(description) {
  const reqKeywords = ['should', 'must', 'require', 'need', 'expected', 'solution'];
  const sentences = description.split(/[.!?]/);
  return sentences.filter(sentence => 
    reqKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
  ).slice(0, 6).map(req => `• ${req.trim()}`).join('\n');
}

// Extract stakeholders from problem description
function extractStakeholders(description) {
  const stakeholderKeywords = ['farmer', 'student', 'patient', 'citizen', 'user', 'government', 'ministry', 'department', 'hospital', 'school', 'college'];
  const found = [];
  stakeholderKeywords.forEach(keyword => {
    if (description.toLowerCase().includes(keyword)) {
      found.push(keyword);
    }
  });
  return found.slice(0, 5);
}

// Extract challenges from problem description
function extractChallenges(description) {
  const challengeKeywords = ['challenge', 'problem', 'issue', 'difficulty', 'lack', 'limited', 'poor', 'inadequate', 'insufficient'];
  const sentences = description.split(/[.!?]/);
  return sentences.filter(sentence => 
    challengeKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
  ).slice(0, 4).map(challenge => `• ${challenge.trim()}`).join('\n');
}

// Extract expected solution from problem description
function extractExpectedSolution(description) {
  const solutionSections = description.match(/Expected Solution[\s\S]*?(?=\n\n|$)/gi);
  if (solutionSections && solutionSections[0]) {
    return solutionSections[0].replace(/Expected Solution:?/gi, '').trim();
  }
  return '';
}

// Generate contextual content based on problem specifics
function generateContextualContent(problemContext, idea) {
  const { title, description, requirements, stakeholders, challenges, expectedSolution, aiEnhancement } = problemContext;
  
  // Generate summary based on actual problem context
  let summary = `• Comprehensive solution addressing: ${title}\n`;
  summary += `• Target stakeholders: ${stakeholders.join(', ')} with direct impact\n`;
  
  if (description.toLowerCase().includes('ai') || description.toLowerCase().includes('machine learning')) {
    summary += `• AI-powered intelligent system with machine learning capabilities\n`;
  }
  if (description.toLowerCase().includes('mobile') || description.toLowerCase().includes('app')) {
    summary += `• Mobile-first application with cross-platform compatibility\n`;
  }
  if (description.toLowerCase().includes('real-time') || description.toLowerCase().includes('monitoring')) {
    summary += `• Real-time monitoring and alert system with dashboard analytics\n`;
  }
  if (description.toLowerCase().includes('blockchain') || description.toLowerCase().includes('security')) {
    summary += `• Blockchain-based security with end-to-end encryption\n`;
  }
  if (description.toLowerCase().includes('iot') || description.toLowerCase().includes('sensor')) {
    summary += `• IoT sensor integration for automated data collection\n`;
  }
  if (description.toLowerCase().includes('cloud') || description.toLowerCase().includes('scalable')) {
    summary += `• Cloud-native architecture ensuring scalability and reliability\n`;
  }
  
  // Add problem-specific features
  if (description.toLowerCase().includes('rural') || description.toLowerCase().includes('remote')) {
    summary += `• Offline-first design for rural and remote area accessibility\n`;
  }
  if (description.toLowerCase().includes('multilingual') || description.toLowerCase().includes('language')) {
    summary += `• Multi-language support with voice-based interaction\n`;
  }
  if (description.toLowerCase().includes('government') || description.toLowerCase().includes('policy')) {
    summary += `• Government policy compliance with regulatory framework integration\n`;
  }
  
  // Add AI enhancement if available
  if (aiEnhancement) {
    const cleanAI = aiEnhancement.replace(/Problem:|Context:|Solution:/gi, '').trim();
    if (cleanAI.length > 50) {
      summary += `• ${cleanAI.split('.')[0].trim()}\n`;
    }
  }
  
  // Ensure minimum 12 points
  const currentPoints = summary.split('\n').filter(line => line.trim().startsWith('•')).length;
  if (currentPoints < 12) {
    summary += `• Advanced analytics and reporting dashboard for insights\n`;
    summary += `• Integration with existing systems and third-party APIs\n`;
    summary += `• Automated workflow management and process optimization\n`;
    summary += `• Comprehensive user training and support documentation\n`;
  }
  
  // Generate technical approach based on problem requirements
  let technicalApproach = generateTechnicalApproach(description, expectedSolution);
  
  // Generate feasibility based on problem context
  let feasibility = generateFeasibilityAnalysis(description, stakeholders);
  
  // Generate impact based on problem scope
  let impact = generateImpactAnalysis(description, stakeholders, title);
  
  // Generate references based on problem domain
  let references = generateReferences(description, title);
  
  return {
    summary,
    technicalApproach,
    feasibility,
    impact,
    references
  };
}

// Generate technical approach based on problem requirements
function generateTechnicalApproach(description, expectedSolution) {
  let approach = '';
  
  // Frontend technologies
  if (description.toLowerCase().includes('mobile') || description.toLowerCase().includes('app')) {
    approach += `• React Native/Flutter for cross-platform mobile development\n`;
  } else {
    approach += `• React.js frontend with responsive design for web application\n`;
  }
  
  // Backend technologies
  approach += `• Node.js/Express.js backend with RESTful API architecture\n`;
  
  // Database selection based on requirements
  if (description.toLowerCase().includes('blockchain')) {
    approach += `• Hyperledger Fabric/Ethereum blockchain for immutable records\n`;
  }
  if (description.toLowerCase().includes('real-time') || description.toLowerCase().includes('monitoring')) {
    approach += `• MongoDB/PostgreSQL with real-time data synchronization\n`;
  } else {
    approach += `• PostgreSQL/MySQL database with optimized query performance\n`;
  }
  
  // AI/ML integration
  if (description.toLowerCase().includes('ai') || description.toLowerCase().includes('machine learning')) {
    approach += `• TensorFlow/PyTorch for machine learning model development\n`;
    approach += `• Python-based AI services with model training pipeline\n`;
  }
  
  // IoT integration
  if (description.toLowerCase().includes('iot') || description.toLowerCase().includes('sensor')) {
    approach += `• IoT device integration with MQTT protocol for sensor data\n`;
    approach += `• Edge computing for local data processing and analysis\n`;
  }
  
  // Cloud and deployment
  approach += `• AWS/Azure cloud infrastructure with auto-scaling capabilities\n`;
  approach += `• Docker containerization with Kubernetes orchestration\n`;
  
  // Security
  approach += `• JWT authentication with role-based access control\n`;
  approach += `• End-to-end encryption for data security and privacy\n`;
  
  // Additional technical features
  approach += `• CI/CD pipeline with automated testing and deployment\n`;
  approach += `• Comprehensive logging and monitoring with alerting system\n`;
  
  return approach;
}

// Generate feasibility analysis
function generateFeasibilityAnalysis(description, stakeholders) {
  let feasibility = `• High technical feasibility using proven technology stack\n`;
  feasibility += `• Strong market demand from ${stakeholders.join(', ')} community\n`;
  
  if (description.toLowerCase().includes('government') || description.toLowerCase().includes('ministry')) {
    feasibility += `• Government support and policy alignment ensuring implementation\n`;
  }
  
  feasibility += `• Cost-effective solution with clear ROI within 18-24 months\n`;
  feasibility += `• Scalable architecture supporting growth from pilot to national level\n`;
  feasibility += `• Skilled development team availability in current market\n`;
  
  if (description.toLowerCase().includes('rural') || description.toLowerCase().includes('remote')) {
    feasibility += `• Offline capabilities addressing connectivity challenges\n`;
  }
  
  feasibility += `• Regulatory compliance framework already established\n`;
  feasibility += `• Existing infrastructure compatibility reducing deployment costs\n`;
  feasibility += `• Strong vendor ecosystem support for technology components\n`;
  feasibility += `• Proven implementation methodology with risk mitigation\n`;
  feasibility += `• Clear success metrics and performance indicators defined\n`;
  
  return feasibility;
}

// Generate impact analysis
function generateImpactAnalysis(description, stakeholders, title) {
  let impact = '';
  
  // Determine scale based on description
  let userScale = '50,000+';
  if (description.toLowerCase().includes('national') || description.toLowerCase().includes('india')) {
    userScale = '1M+';
  } else if (description.toLowerCase().includes('state') || description.toLowerCase().includes('regional')) {
    userScale = '500,000+';
  }
  
  impact += `• Direct benefit to ${userScale} ${stakeholders[0] || 'users'} in first year of implementation\n`;
  
  // Efficiency improvements
  if (description.toLowerCase().includes('automation') || description.toLowerCase().includes('digital')) {
    impact += `• 40-60% improvement in operational efficiency through automation\n`;
  } else {
    impact += `• 25-35% improvement in process efficiency and user experience\n`;
  }
  
  // Cost savings
  impact += `• Annual cost savings of ₹10-50 crores through process optimization\n`;
  
  // Time savings
  if (description.toLowerCase().includes('real-time') || description.toLowerCase().includes('monitoring')) {
    impact += `• 70% reduction in response time for critical operations\n`;
  } else {
    impact += `• 50% reduction in manual processing time and errors\n`;
  }
  
  // Employment and economic impact
  impact += `• Creation of 1,000+ direct and indirect employment opportunities\n`;
  
  // Social impact
  if (description.toLowerCase().includes('health') || description.toLowerCase().includes('medical')) {
    impact += `• Improved health outcomes for underserved populations\n`;
  } else if (description.toLowerCase().includes('education') || description.toLowerCase().includes('learning')) {
    impact += `• Enhanced educational access and learning outcomes\n`;
  } else {
    impact += `• Improved quality of life for target beneficiary communities\n`;
  }
  
  // Environmental impact
  if (description.toLowerCase().includes('environment') || description.toLowerCase().includes('green')) {
    impact += `• Positive environmental impact through sustainable practices\n`;
  }
  
  // Digital transformation
  impact += `• Contribution to Digital India mission and technology adoption\n`;
  
  // Policy impact
  if (description.toLowerCase().includes('government') || description.toLowerCase().includes('policy')) {
    impact += `• Data-driven policy insights for evidence-based decision making\n`;
  }
  
  // Innovation impact
  impact += `• Replicable model for similar challenges across other regions\n`;
  impact += `• Technology transfer and knowledge sharing opportunities\n`;
  impact += `• Enhanced India's position in global technology innovation\n`;
  
  return impact;
}

// Generate references based on problem domain
function generateReferences(description, title) {
  let references = [];
  
  if (description.toLowerCase().includes('health') || description.toLowerCase().includes('medical')) {
    references = ['National Health Mission Guidelines', 'WHO Digital Health Standards', 'Ministry of Health Policy Framework', 'Medical Device Regulations', 'Healthcare Technology Assessment Reports'];
  } else if (description.toLowerCase().includes('education') || description.toLowerCase().includes('learning')) {
    references = ['National Education Policy 2020', 'UNESCO Education Technology Reports', 'NCERT Digital Learning Guidelines', 'Educational Research Studies', 'Ministry of Education Technology Framework'];
  } else if (description.toLowerCase().includes('agriculture') || description.toLowerCase().includes('farm')) {
    references = ['National Agriculture Policy', 'ICAR Research Guidelines', 'Ministry of Agriculture Technology Mission', 'Precision Farming Case Studies', 'Agricultural Innovation Reports'];
  } else if (description.toLowerCase().includes('railway') || description.toLowerCase().includes('transport')) {
    references = ['Ministry of Railways Technical Standards', 'Transportation Research Papers', 'Railway Safety Guidelines', 'Infrastructure Development Reports', 'Smart Transportation Studies'];
  } else if (description.toLowerCase().includes('ayush') || description.toLowerCase().includes('ayurveda')) {
    references = ['Ministry of AYUSH Guidelines', 'Traditional Medicine Research', 'Ayurvedic Standards and Protocols', 'WHO Traditional Medicine Reports', 'Herbal Medicine Quality Standards'];
  } else {
    references = ['Government Policy Guidelines', 'Digital India Initiative', 'Technology Implementation Standards', 'Industry Best Practices', 'Research and Development Reports'];
  }
  
  return references;
}

module.exports = {
  generateProblemSpecificContent,
  extractRequirements,
  extractStakeholders,
  extractChallenges,
  extractExpectedSolution,
  generateContextualContent,
  generateTechnicalApproach,
  generateFeasibilityAnalysis,
  generateImpactAnalysis,
  generateReferences
};