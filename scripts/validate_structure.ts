import fs from 'fs';
import path from 'path';

const requiredFiles = [
  // Configuration & Libs
  'src/lib/config.ts',
  'src/lib/pinecone.ts',
  'src/lib/openai.ts',
  'src/lib/rag.ts',
  
  // API Routes
  'src/app/api/prompt/route.ts',
  'src/app/api/stats/route.ts',
  
  // UI Components & Pages
  'src/app/page.tsx',
  'src/components/Header.tsx',
  
  // Scripts
  'scripts/ingest.ts',
  
  // Environment Variables
  '.env.local',
  
  // Data (Optional check)
  'data/ted_talks_en.csv'
];

async function main() {
  console.log('🔍 Starting Project Structure Validation...\n');
  
  let missingCount = 0;

  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ MISSING: ${file}`);
      missingCount++;
    }
  });

  console.log('\n-----------------------------------');
  if (missingCount === 0) {
    console.log('🎉 Success! All required files are present.');
    console.log('You are ready to run: npm run dev');
  } else {
    console.log(`⚠️  Warning: ${missingCount} files are missing.`);
    console.log('Please define them before running the app.');
  }
  console.log('-----------------------------------');
}

main().catch(console.error);