import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const CLAUDE_MODELS = [
  'claude-3-sonnet',
  'claude-3-opus',
  'claude-3.5-sonnet',
  'claude-3.5-opus',
  'claude-3-haiku',
];

const GPT_MODELS = [
  'gpt-5.2',
  'gpt-5.5',
  'gpt-5.4',
  'gpt-5.4-mini',
  'gpt-5.3-codex-spark',
  'gpt-5.3-codex',
  'codex-mini-latest',
];

function createClient(apiKey, model) {
  if (CLAUDE_MODELS.includes(model)) {
    return new OpenAI({
      apiKey: apiKey || process.env.CCSWITCH_API_KEY,
      baseURL: 'https://api.ccswitch.cc/v1',
    });
  }
  if (GPT_MODELS.includes(model)) {
    return new OpenAI({
      apiKey: apiKey || process.env.SIXONER_API_KEY,
      baseURL: 'https://sub.sixoner.com/v1',
    });
  }
  return new OpenAI({
    apiKey: apiKey || process.env.MOONSHOT_API_KEY,
    baseURL: 'https://api.moonshot.cn/v1',
  });
}

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.get('/', (req, res) => {
  res.redirect('/promo.html');
});
app.use(express.static(join(__dirname, 'public')));

app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model = 'kimi-k3', stream = false, reasoning_effort = 'max', apiKey, ...otherOptions } = req.body;
    
    const authHeader = req.headers.authorization;
    const requestApiKey = apiKey || (authHeader ? authHeader.replace('Bearer ', '') : null);
    const client = createClient(requestApiKey, model);

    const options = {
      model,
      messages,
      stream,
      ...otherOptions,
    };
    if (!CLAUDE_MODELS.includes(model) && !GPT_MODELS.includes(model)) {
      options.reasoning_effort = reasoning_effort;
    }

    const response = await client.chat.completions.create(options);

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of response) {
        const data = JSON.stringify(chunk);
        res.write(`data: ${data}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      res.json(response);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/v1/models', async (req, res) => {
  try {
    const models = {
      object: 'list',
      data: [
        {
          id: 'kimi-k3',
          object: 'model',
          created: Date.now(),
          owned_by: 'moonshot',
          root: 'kimi-k3',
          parent: null,
        },
        {
          id: 'kimi-k2.7-code-highspeed',
          object: 'model',
          created: Date.now(),
          owned_by: 'moonshot',
          root: 'kimi-k2.7-code-highspeed',
          parent: null,
        },
        {
          id: 'kimi-k2.6',
          object: 'model',
          created: Date.now(),
          owned_by: 'moonshot',
          root: 'kimi-k2.6',
          parent: null,
        },
        {
          id: 'claude-3.5-sonnet',
          object: 'model',
          created: Date.now(),
          owned_by: 'ccswitch',
          root: 'claude-3.5-sonnet',
          parent: null,
        },
        {
          id: 'claude-3.5-opus',
          object: 'model',
          created: Date.now(),
          owned_by: 'ccswitch',
          root: 'claude-3.5-opus',
          parent: null,
        },
        {
          id: 'claude-3-sonnet',
          object: 'model',
          created: Date.now(),
          owned_by: 'ccswitch',
          root: 'claude-3-sonnet',
          parent: null,
        },
        {
          id: 'claude-3-opus',
          object: 'model',
          created: Date.now(),
          owned_by: 'ccswitch',
          root: 'claude-3-opus',
          parent: null,
        },
        {
          id: 'claude-3-haiku',
          object: 'model',
          created: Date.now(),
          owned_by: 'ccswitch',
          root: 'claude-3-haiku',
          parent: null,
        },
        {
          id: 'gpt-5.5',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.5',
          parent: null,
        },
        {
          id: 'gpt-5.4',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.4',
          parent: null,
        },
        {
          id: 'gpt-5.2',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.2',
          parent: null,
        },
        {
          id: 'gpt-5.4-mini',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.4-mini',
          parent: null,
        },
        {
          id: 'gpt-5.3-codex-spark',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.3-codex-spark',
          parent: null,
        },
        {
          id: 'gpt-5.3-codex',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'gpt-5.3-codex',
          parent: null,
        },
        {
          id: 'codex-mini-latest',
          object: 'model',
          created: Date.now(),
          owned_by: 'sixoner',
          root: 'codex-mini-latest',
          parent: null,
        },
      ],
    };
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Kimi K3 Proxy Service running on http://localhost:${PORT}`);
  console.log(`Service accessible externally at http://0.0.0.0:${PORT}`);
});