# 🚀 Resume AI Toolkit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@ozsparkhub/resume-ai-toolkit.svg)](https://www.npmjs.com/package/@ozsparkhub/resume-ai-toolkit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**Open-source AI-powered resume analysis toolkit** specifically designed for the **Australian job market**. Parse resumes, analyze ATS compatibility, and get keyword matching insights.

## ✨ Features

- 📄 **Multi-format Parser**: PDF, Word (.docx), and plain text
- 🎯 **ATS Scoring**: 3-dimension basic scoring (keyword match, format, semantic similarity)
- 🔍 **Keyword Matching**: Cosine similarity-based keyword analysis
- 🇦🇺 **Australian Market**: Sample keywords and format templates for AU job market
- ⚡ **Fast & Lightweight**: Zero external API dependencies for basic features
- 🛠️ **Developer-Friendly**: TypeScript, well-documented, easy to integrate

## 📦 Installation

```bash
npm install @ozsparkhub/resume-ai-toolkit
```

Or with yarn:

```bash
yarn add @ozsparkhub/resume-ai-toolkit
```

## 🚀 Quick Start

```typescript
import { parseResume, scoreResume } from '@ozsparkhub/resume-ai-toolkit';

// Parse a resume
const resumeText = await parseResume('./resume.pdf');

// Score against a job description
const score = await scoreResume(resumeText, jobDescription);

console.log(`ATS Score: ${score.overall}/100`);
console.log(`Missing keywords: ${score.missingKeywords.join(', ')}`);
```

## 📊 What's Included (Open Source)

| Feature | Open Source Toolkit | Full SaaS Platform |
|---------|-------------------|-------------------|
| Resume Parsing | ✅ PDF, Word, Text | ✅ All formats |
| ATS Scoring | ✅ Basic 3-dimension | ⭐ AI-enhanced 6-dimension |
| Keyword Database | ✅ 100 sample keywords | ⭐ 10,000+ industry keywords |
| Australian Market Analysis | ❌ | ⭐ 20 years expertise |
| AI Resume Rewriting | ❌ | ⭐ Gemini-powered |
| Interview Preparation | ❌ | ⭐ Role-specific |
| Visa Status Analysis | ❌ | ⭐ AU migration insights |

## 🌟 Want More Power?

This open-source toolkit is perfect for learning and basic use cases.

**For serious job seekers**, our **full SaaS platform** offers:

- ⭐ **10,000+ Australian industry keywords** (vs 100 samples)
- ⭐ **AI-enhanced 6-dimension scoring** (vs 3-dimension basic)
- ⭐ **Australian market expert analysis** (20 years of local expertise)
- ⭐ **AI-powered resume rewriting** (Gemini-driven optimization)
- ⭐ **Interview preparation** & **salary negotiation** guidance
- ⭐ **Visa status insights** for Australian job market

**[Try Full Platform FREE for 7 days →](https://store.ozsparkhub.com.au/tools/resume-optimizer)**

No credit card required. Cancel anytime.

## 📖 Documentation

### Parsing Resumes

```typescript
import { PDFParser, WordParser, TextParser } from '@ozsparkhub/resume-ai-toolkit';

// PDF
const pdfParser = new PDFParser();
const resumeText = await pdfParser.parse('./resume.pdf');

// Word
const wordParser = new WordParser();
const resumeText = await wordParser.parse('./resume.docx');

// Plain text
const textParser = new TextParser();
const resumeText = textParser.parse(rawText);
```

### ATS Scoring

```typescript
import { ATSScorer } from '@ozsparkhub/resume-ai-toolkit';

const scorer = new ATSScorer();
const result = scorer.score(resumeText, jobDescription);

console.log(result);
// {
//   overall: 78,
//   breakdown: {
//     keywordMatch: 75,
//     formatScore: 85,
//     semanticSimilarity: 74
//   },
//   missingKeywords: ['Docker', 'Kubernetes', 'AWS'],
//   recommendations: [...]
// }
```

### Keyword Analysis

```typescript
import { KeywordMatcher } from '@ozsparkhub/resume-ai-toolkit';

const matcher = new KeywordMatcher();
const analysis = matcher.analyze(resumeText, industryKeywords);

console.log(analysis.matchedKeywords);  // Keywords found in resume
console.log(analysis.missingKeywords);  // Important keywords missing
console.log(analysis.matchScore);       // 0-100 score
```

## 🇦🇺 Australian Resume Templates

```typescript
import { AustralianTemplate } from '@ozsparkhub/resume-ai-toolkit';

const template = new AustralianTemplate();
const formatted = template.format(resumeData);

// Generates AU-standard 2-page resume with:
// - Personal details (no photo)
// - Professional summary
// - Key skills
// - Work experience (reverse chronological)
// - Education
// - Certifications (if relevant)
```

## 🧪 Running Tests

```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Full SaaS Platform**: [store.ozsparkhub.com.au](https://store.ozsparkhub.com.au/tools/resume-optimizer)
- **Blog**: [www.ozsparkhub.com.au](https://www.ozsparkhub.com.au)
- **Issues**: [GitHub Issues](https://github.com/ozsparkhub/resume-ai-toolkit/issues)

## 💡 Why We Built This

After helping **1,000+ job seekers** in Australia optimize their resumes, we noticed that:

- 72% of resumes fail ATS screening due to poor keyword optimization
- Most resume tools don't understand Australian job market specifics
- Developers and tech professionals need programmatic access to resume analysis

This toolkit solves these problems with:
- ✅ Australian market-specific knowledge
- ✅ Modern tech stack (TypeScript, easy integration)
- ✅ Open source transparency
- ✅ Clear upgrade path to full platform

---

**Made with 🦊 by [OzSparkHub](https://www.ozsparkhub.com.au)** - Empowering job seekers in Australia since 2005

> 💡 **Pro tip**: Use this toolkit for development and testing, upgrade to [full platform](https://store.ozsparkhub.com.au/tools/resume-optimizer) when applying for real jobs.
