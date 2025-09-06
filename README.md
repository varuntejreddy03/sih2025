# 🏆 SIH 2025 Winner Format PPT Generator

A comprehensive **Smart India Hackathon PPT Auto-Builder** that follows **official SIH hackathon winner guidelines** to create winning presentations with AI research, scoring, and judge preparation.

## ✨ Key Features

### 🏆 SIH Winner Format Compliance
- **Strict 6-Slide Format**: Follows official SIH template exactly
- **Bullet Points Only**: No paragraphs, concise point-based content
- **Visual Storytelling**: Architecture diagrams and flowcharts ready
- **Clarity & Uniqueness**: Each slide focused with novel highlights
- **PDF Export Ready**: Save/submit as PDF following SIH requirements

### 🎯 Core Functionality
- **Problem Statement Browser**: Browse 135+ SIH 2025 problem statements
- **Advanced Search & Filtering**: Search by theme, ministry, category, and keywords
- **AI-Powered Research**: Auto-research using HuggingFace APIs
- **Winner Format PPT Generation**: Creates presentations following SIH winner guidelines
- **Auto-Scoring System**: Rates ideas on Novelty, Feasibility, Impact (9-10 range)
- **Judge Q&A Prep**: Generates top 5 likely questions with draft answers

### 📊 Advanced Features
- **SPOC Dashboard**: Theme-wise analytics and selection tracking
- **Research Caching**: Stores AI-generated content for reuse
- **Score Analytics**: Performance metrics across themes (optimized for 9-10 scores)
- **Export Capabilities**: Download winner format presentations and content
- **Real-time Updates**: Live dashboard with selection statistics
- **Judge Preparation**: Comprehensive Q&A with presentation tips

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide React (icons)

### Backend
- **Node.js + Express**: Fast, scalable server
- **SQLite**: Lightweight database for selections and research cache
- **AI Integration**: HuggingFace APIs for text processing
- **Auto-Research**: DuckDuckGo/Serper integration ready
- **Smart Scoring**: Algorithm-based idea evaluation

## Setup Instructions

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start Express server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

### 🚀 Quick Start (Both Servers)

Run the batch file to start both frontend and backend:
```bash
start.bat
```

### 🏆 Winner Format Usage

1. Generate presentation using the tool
2. Download both PPTX and content files
3. Open the existing SIH template: `SIH2025-IDEA-Presentation-Format.pptx`
4. Replace content with generated bullet points (preserve template formatting)
5. Add visual elements: diagrams, flowcharts, screenshots
6. Keep slides concise and focused
7. Save as PDF for submission

## Project Structure

```
sih_pro/
├── src/
│   ├── components/
│   │   └── ProblemBrowser.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── backend/
│   ├── app.py
│   └── requirements.txt
├── public/
│   └── sih2025_problems.json
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Core APIs
- `GET /api/problems` - Fetch all problem statements
- `POST /generate_ppt` - Generate AI-enhanced PPT with research & scoring
- `POST /api/save_selection` - Save problem selection to database
- `GET /api/dashboard` - Retrieve saved selections
- `POST /download_ppt` - Download generated presentation

### Advanced APIs
- `GET /api/spoc/dashboard` - SPOC analytics dashboard
- Research caching and scoring system
- Judge Q&A preparation endpoints

## Usage

1. Browse problem statements using search and filters
2. Click "Select Problem" on any problem card
3. Enter your idea draft in the modal (optional - AI will enhance or generate)
4. Click "Generate SIH Winner PPT" to create presentation following official guidelines
5. Download both PPTX file and winner format content
6. Use the existing SIH template and replace content with generated bullet points
7. Add diagrams and visual elements as recommended
8. Save as PDF for final submission

## 🏆 SIH Winner Guidelines Compliance

### Official Requirements Met:
- **✅ Strict 6-Slide Format**: Problem & Solution, Technical Approach, Feasibility, Impact & Benefits, Research & Implementation
- **✅ Bullet Points Only**: No paragraphs, concise point-based style
- **✅ Visual Storytelling**: Architecture diagrams and flowcharts recommended
- **✅ Clarity & Uniqueness**: Each slide focused with innovation highlights
- **✅ Template Compliance**: Works with official SIH presentation template
- **✅ PDF Export Ready**: Content formatted for final PDF submission

### Presentation Tips Included:
- Use diagrams, UI mockups, or data charts instead of text
- Show system architecture flowchart on Technical Approach slide
- Include screenshots or prototype demos if available
- Keep each slide under 6 bullet points maximum
- Highlight what makes your solution NOVEL and UNIQUE
- Practice 3-minute presentation (30 seconds per slide)

## Data Source

The application uses the SIH 2025 problem statements JSON file containing:
- Problem Statement ID and Title
- Organization/Ministry
- Theme and Category
- Detailed Description
- Department information