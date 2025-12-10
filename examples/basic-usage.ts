/**
 * Basic Usage Example
 * Shows how to parse a resume and get ATS score
 */

import { parseResume, scoreResume, quickScore } from '../src';

async function main() {
  console.log('🚀 Resume AI Toolkit - Basic Usage Example\n');

  // Example 1: Parse a resume file
  console.log('1. Parsing resume...');
  const result = await parseResume('./examples/sample-resume.pdf');

  if (!result.success) {
    console.error('❌ Failed to parse resume:', result.error);
    return;
  }

  console.log('✅ Resume parsed successfully');
  console.log(`   File type: ${result.fileType}`);
  console.log(`   Text length: ${result.text.length} characters\n`);

  // Example 2: Quick score (without job description)
  console.log('2. Quick ATS score (using sample keywords)...');
  const quickResult = quickScore(result.text);

  console.log(`\n📊 Quick ATS Score: ${quickResult.overall}/100`);
  console.log('\nBreakdown:');
  console.log(`   Keyword Match: ${quickResult.breakdown.keywordMatch}/100`);
  console.log(`   Format Score: ${quickResult.breakdown.formatScore}/100`);
  console.log(`   Semantic Similarity: ${quickResult.breakdown.semanticSimilarity}/100`);

  console.log(`\n✅ Found ${quickResult.keywords.foundCount} keywords`);
  console.log(`⚠️  Missing ${quickResult.keywords.missingCount} keywords`);

  if (quickResult.issues.length > 0) {
    console.log('\n🚨 Issues found:');
    quickResult.issues.forEach(issue => {
      console.log(`   [${issue.severity}] ${issue.message}`);
      if (issue.fix) {
        console.log(`   Fix: ${issue.fix}`);
      }
    });
  }

  // Example 3: Score against specific job description
  console.log('\n3. Scoring against job description...');

  const jobDescription = `
    Software Engineer - Full Stack

    We're looking for an experienced Full Stack Developer to join our team.

    Required Skills:
    - JavaScript, TypeScript, React, Node.js
    - AWS, Docker, Kubernetes
    - SQL, MongoDB
    - API design and development
    - Agile methodology
    - Strong communication skills

    Nice to have:
    - Next.js, Vue.js
    - CI/CD experience
    - Machine Learning background
  `;

  const detailedResult = scoreResume(result.text, jobDescription);

  console.log(`\n📊 Detailed ATS Score: ${detailedResult.overall}/100`);
  console.log('\nTop matching terms:');
  detailedResult.similarity.topMatchingTerms.forEach(term => {
    console.log(`   • ${term}`);
  });

  console.log('\nMissing important keywords:');
  detailedResult.keywords.missing.slice(0, 10).forEach(keyword => {
    console.log(`   ⚠️  ${keyword}`);
  });

  console.log('\n💡 Suggestions:');
  detailedResult.suggestions.forEach(suggestion => {
    console.log(`   • ${suggestion}`);
  });

  console.log('\n✨ Want more advanced features?');
  console.log('   Try our full platform: https://store.ozsparkhub.com.au/tools/resume-optimizer');
  console.log('   • 10,000+ Australian industry keywords');
  console.log('   • AI-enhanced 6-dimension scoring');
  console.log('   • Australian market expert analysis');
  console.log('   • AI-powered resume rewriting\n');
}

main().catch(console.error);
