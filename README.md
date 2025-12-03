# 🎯 AI Resume Optimizer for Australian Job Market

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

> An open-source, AI-powered resume optimization toolkit specifically designed for the Australian employment market. Built with 20+ years of data analytics and employment services expertise.

<div align="center">

  ### 🌟 From [OzSparkHub](https://www.ozsparkhub.com.au) - Your Career Growth Partner

  **[📚 Read 120+ Free Career Articles](https://www.ozsparkhub.com.au) | [🛠️ Explore AI Career Tools](https://store.ozsparkhub.com.au) | [⭐ Star This Repo](#)**

</div>

## ✨ Why This Exists

After helping thousands of job seekers in Australia, I noticed a pattern: **great candidates were being filtered out by ATS systems before humans even saw their resumes.** This toolkit solves that problem using AI and deep knowledge of Australian hiring practices.

**Now available as open source to help job seekers worldwide.** 🎁

---

## 🚀 Features

### Core Capabilities
- 🤖 **AI-Powered Analysis** - Uses Google Gemini for intelligent resume enhancement
- 🇦🇺 **Australian Market Focus** - Optimized for SEEK, LinkedIn AU, and local ATS systems
- 📄 **Smart File Parsing** - Supports PDF, Word, TXT with Microsoft MarkItDown integration
- 🎯 **Industry-Specific Keywords** - 30+ industries with 10,000+ optimized keywords
- 📊 **ATS Compatibility Score** - Real-time scoring against Australian ATS standards
- 🔍 **Semantic Matching** - Goes beyond keyword matching to understand context
- 💼 **Job Description Optimizer** - Rewrites experience with action verbs and metrics
- 🎤 **Interview Question Generator** - Prepares you for Australian workplace questions

### Australian-Specific Optimizations
- ✅ 2-page resume format preference
- ✅ Local terminology and spelling (Australian English)
- ✅ Visa status considerations
- ✅ Cultural fit indicators
- ✅ Industry certifications recognized in Australia
- ✅ STAR method behavioral examples

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.0
- **AI**: Google Gemini API
- **Parsing**: Microsoft MarkItDown + custom parsers
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Database** (optional): Supabase

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get free key](https://aistudio.google.com/app/apikey))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/resume-ai.git
cd resume-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GOOGLE_GENERATIVE_AI_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

```env
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional (for enhanced features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 💡 Usage Examples

### 1. Basic Resume Analysis

```typescript
import { ResumeAIService } from './ai-service'

const resumeData = {
  personalInfo: {
    name: "Jane Smith",
    email: "jane@example.com",
    // ...
  },
  experience: [...],
  skills: ["Data Analysis", "Python", "SQL"]
}

// Generate AI-powered summary
const summary = await ResumeAIService.generateSummary(resumeData)

// Enhance job descriptions
const enhanced = await ResumeAIService.enhanceJobDescription(
  "Managed data projects",
  "Data Analyst"
)
```

### 2. Australian Hiring Expert Analysis

```typescript
// Get deep Australian market insights
const analysis = await ResumeAIService.australianHiringExpertAnalysis(
  resumeText,
  "Technology",
  "Software Engineer",
  jobDescription
)

// Returns: ATS score, keyword gaps, cultural fit advice, visa considerations
```

### 3. Job Fit Analysis

```typescript
// Brutally honest job fit assessment
const fitAnalysis = await ResumeAIService.australianJobFitAnalysis(
  resumeText,
  jobDescription,
  "Healthcare"
)

// Returns: Fit score, strengths, gaps, realistic recommendations
```

---

## 🎯 Australian Market Insights

This toolkit incorporates insights from:
- **15+ years** of Australian recruitment patterns
- **30+ industries** including Healthcare, IT, Finance, Construction, Education
- **Real ATS systems** used by SEEK, LinkedIn, Indeed Australia
- **Cultural preferences** of Australian employers
- **Visa status** implications for hiring decisions

### Supported Industries

Healthcare | Technology | Finance | Construction | Education | Hospitality | Retail | Manufacturing | Legal | Marketing | Engineering | Government | Nonprofit | Agriculture | Mining | Real Estate | Transport | Creative | Consulting | ...and more

---

## 🏗️ Project Structure

```
resume-ai/
├── ai-service.ts                    # Core AI service (Gemini integration)
├── file-parser-markitdown.ts        # Microsoft MarkItDown parser
├── ats-engine.ts                    # ATS scoring engine
├── industry-keywords-database.ts    # 10,000+ industry keywords
├── australian-hiring-analyzer.ts    # AU market analyzer
├── pdf-generator.ts                 # Resume export (PDF/Word)
└── ...
```

---

## 🎁 Why Open Source?

I believe **great tools should be accessible to everyone**. This AI resume optimizer represents my 20+ years of experience in data analytics and employment services, now available for free to help job seekers worldwide.

### 📚 Want More Career Insights & Tools?

This is just one of my projects. Visit **[OzSparkHub](https://www.ozsparkhub.com.au)** for:

- 📝 **[Career Strategy Blog](https://www.ozsparkhub.com.au)** - 120+ articles on Australian job market trends, salary insights, and career advancement
- 💰 **[What's My Worth](https://www.ozsparkhub.com.au/career-tools/whats-my-worth)** - AI salary analyzer for Australian market
- 🤖 **[AI Job Threat Calculator](https://www.ozsparkhub.com.au/career-tools/ai-job-threat)** - Future-proof your career against automation
- 😤 **[Rage Quit Readiness Quiz](https://www.ozsparkhub.com.au/career-tools/rage-quit-quiz)** - Know when it's time to move on
- 🛍️ **[Full AI Tools Suite](https://store.ozsparkhub.com.au)** - 20+ AI-powered career tools

**Start here**: [www.ozsparkhub.com.au](https://www.ozsparkhub.com.au) - Your hub for Australian employment insights and AI career tools

---

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🌍 Translations
- 🎨 UI/UX enhancements

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TLDR**: You can use, modify, and distribute this code freely, even for commercial purposes. Just keep the original copyright notice.

---

## 🙏 Acknowledgments

- **Microsoft MarkItDown** - Excellent document parsing library
- **Google Gemini** - Powerful and accessible AI API
- **Australian Job Seekers** - For inspiring this project
- **Open Source Community** - For making great tools accessible

---

## 👨‍💻 About the Creator

Built by **OzSparkHub** - Where Data Meets Human Touch

With 20+ years in data analytics, business intelligence, and Australian employment services, I specialize in turning complex data into practical tools that actually help people navigate their careers.

**What Makes This Different**:
- 📊 Built on real hiring data from 15+ years in Australian recruitment
- 🤖 AI that understands Australian workplace culture, not just keywords
- 💼 Created by someone who's been both hiring manager and job seeker
- 🎨 Data × Creativity × Empathy = Tools that actually work

**Explore More**:
- 🏠 **Main Hub**: [www.ozsparkhub.com.au](https://www.ozsparkhub.com.au) - Career insights, salary trends, and 120+ free articles
- 🛠️ **AI Tools**: [store.ozsparkhub.com.au](https://store.ozsparkhub.com.au) - Premium career tools for serious job seekers
- 💡 **Blog**: Check out articles on [resume optimization](https://www.ozsparkhub.com.au/career-development), [salary negotiation](https://www.ozsparkhub.com.au/job-hunting), and [Australian job market trends](https://www.ozsparkhub.com.au)

---

## 📈 Roadmap

- [ ] OCR support for image-based PDFs
- [ ] Multi-language support (Mandarin, Hindi, Arabic)
- [ ] LinkedIn profile optimizer
- [ ] Cover letter generator
- [ ] Interview preparation module
- [ ] Salary negotiation advisor
- [ ] Industry trend insights

---

## ⭐ Star This Repo!

If this tool helped you land an interview or improve your resume, please star this repo! It helps others discover this free resource.

**Made with 💙 for job seekers everywhere**

---

## 📧 Support & Community

- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/resume-ai/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/resume-ai/discussions)
- 📝 **Career Questions**: Check out [120+ free articles](https://www.ozsparkhub.com.au) on job hunting, salary negotiation, and career growth
- 🤝 **Professional Help**: Need personalized career coaching? Visit [OzSparkHub](https://www.ozsparkhub.com.au) for premium services

---

<div align="center">

**[⬆ Back to Top](#-ai-resume-optimizer-for-australian-job-market)**

</div>
