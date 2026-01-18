import fs from 'fs';

// Get secret from environment
const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.error('❌ GROQ_API_KEY not set in environment!');
  process.exit(1);
}

// Read prompt.html
let html = fs.readFileSync('prompt.html', 'utf8');

// Replace placeholder
html = html.replace(/\$\{GROQ_API_KEY\}/g, groqApiKey);

// Write back
fs.writeFileSync('prompt.html', html);

console.log('✅ Injected GROQ_API_KEY into prompt.html');
