const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.argv[2];

if (!apiKey) {
  console.error('Usage: node test-gemini-models.js YOUR_API_KEY');
  process.exit(1);
}

async function listAndTestModels() {
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log('Testing different Gemini model names...\n');

  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash',
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`   Response: ${text.substring(0, 50)}\n`);
    } catch (error) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`   Error: ${error.message.substring(0, 100)}\n`);
    }
  }

  // Try to list available models
  console.log('\n=== Attempting to list models via API ===');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('\nAvailable models:');
      data.models?.forEach(model => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`  - ${model.name} (${model.displayName})`);
        }
      });
    } else {
      console.log('Failed to list models:', response.status);
    }
  } catch (error) {
    console.log('Error listing models:', error.message);
  }
}

listAndTestModels();
