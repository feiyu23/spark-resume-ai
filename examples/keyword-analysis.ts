/**
 * Keyword Analysis Example
 * Shows how to analyze keyword matching in detail
 */

import { parseResume, matchKeywords, getAllKeywords, getKeywordsByCategory } from '../src';

async function main() {
  console.log('🔍 Resume AI Toolkit - Keyword Analysis Example\n');

  // Parse resume
  const result = await parseResume('./examples/sample-resume.pdf');

  if (!result.success) {
    console.error('❌ Failed to parse resume:', result.error);
    return;
  }

  console.log('✅ Resume parsed successfully\n');

  // Example 1: Match against all sample keywords
  console.log('1. Matching against all sample keywords...');
  const allKeywords = getAllKeywords();
  const allMatch = matchKeywords(result.text, allKeywords);

  console.log(`\n📊 Overall Match: ${allMatch.matchScore}/100`);
  console.log(`   Found: ${allMatch.foundCount}/${allMatch.totalKeywords} keywords`);

  // Example 2: Category-specific analysis
  console.log('\n2. Category-specific keyword analysis:');

  const categories = ['technology', 'business', 'healthcare', 'australian', 'softSkills'];

  categories.forEach(category => {
    const keywords = getKeywordsByCategory(category);
    const match = matchKeywords(result.text, keywords);

    console.log(`\n   ${category}:`);
    console.log(`   Score: ${match.matchScore}/100 (${match.foundCount}/${match.totalKeywords})`);

    if (match.foundCount > 0) {
      console.log(`   Found: ${match.found.slice(0, 5).join(', ')}...`);
    }

    if (match.missingCount > 0 && match.missingCount <= 10) {
      console.log(`   Missing: ${match.missing.join(', ')}`);
    }
  });

  // Example 3: Custom keyword list
  console.log('\n3. Custom keyword matching:');

  const customKeywords = [
    'leadership', 'project management', 'agile',
    'python', 'machine learning', 'data science',
    'communication', 'teamwork'
  ];

  const customMatch = matchKeywords(result.text, customKeywords);

  console.log(`\n   Custom Keywords Match: ${customMatch.matchScore}/100`);
  console.log(`   Found: ${customMatch.found.join(', ')}`);
  console.log(`   Missing: ${customMatch.missing.join(', ')}`);

  console.log('\n💡 Pro Tip:');
  console.log('   For 10,000+ industry-specific Australian keywords, upgrade to:');
  console.log('   https://store.ozsparkhub.com.au/tools/resume-optimizer\n');
}

main().catch(console.error);
