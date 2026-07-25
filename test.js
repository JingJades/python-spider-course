import { OpenAI } from 'openai';
import 'dotenv/config';

async function testKimiK3() {
  console.log('Testing Kimi K3 API connection...\n');

  const client = new OpenAI({
    apiKey: process.env.MOONSHOT_API_KEY,
    baseURL: 'https://api.moonshot.ai/v1',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'kimi-k3',
      messages: [
        {
          role: 'system',
          content: 'You are Kimi, an AI assistant provided by Moonshot AI. You are especially good at conversations in Chinese and English.',
        },
        {
          role: 'user',
          content: '你好！请简单介绍一下你自己。',
        },
      ],
      reasoning_effort: 'max',
    });

    console.log('Response from Kimi K3:');
    console.log('=======================');
    console.log(response.choices[0].message.content);
    console.log('\n✅ Kimi K3 API connection successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check your MOONSHOT_API_KEY and try again.');
  }
}

async function testClaude() {
  console.log('\nTesting Claude API via CC Switch...\n');

  const client = new OpenAI({
    apiKey: process.env.CCSWITCH_API_KEY,
    baseURL: 'https://api.ccswitch.cc/v1',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'claude-3.5-sonnet',
      messages: [
        {
          role: 'user',
          content: 'Hello! Please introduce yourself briefly.',
        },
      ],
    });

    console.log('Response from Claude 3.5 Sonnet:');
    console.log('===============================');
    console.log(response.choices[0].message.content);
    console.log('\n✅ Claude API connection successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease check your CCSWITCH_API_KEY and try again.');
  }
}

async function runTests() {
  await testKimiK3();
  await testClaude();
}

runTests();