import fs from "fs";

// ===============================
// ENVIRONMENT VARIABLES
// ===============================
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

// ===============================
// REQUIRED CHECKS
// ===============================
if (!groqApiKey) {
  console.error("❌ GROQ_API_KEY is not set!");
  process.exit(1);
}

// (Optional checks – keep for future use)
if (firebaseApiKey === undefined) {
  console.warn("⚠️ FIREBASE_API_KEY not set (skipping)");
}
if (sheetsApiKey === undefined) {
  console.warn("⚠️ GOOGLE_SHEETS_API_KEY not set (skipping)");
}

// ===============================
// FILES TO PROCESS (ADD MORE HERE)
// ===============================
const filesToProcess = [
  "prompt.html" 
];

// ===============================
// PROCESS FILES
// ===============================
filesToProcess.forEach((filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, "utf8");

    // Firebase
    if (firebaseApiKey) {
      content = content.replace(
        /\$\{FIREBASE_API_KEY\}/g,
        firebaseApiKey
      );
    }

    // Google Sheets
    if (sheetsApiKey) {
      content = content.replace(
        /\$\{GOOGLE_SHEETS_API_KEY\}/g,
        sheetsApiKey
      );
    }

    // Groq (used in prompt.html)
    content = content.replace(
      /\$\{GROQ_API_KEY\}/g,
      groqApiKey
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Secrets injected: ${filePath}`);

  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
});

console.log("🚀 Glowera AI build completed successfully!");
