const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');

/**
 * BankCorp AI Assistant Chat API
 * Unified chat interface for customer support and account inquiries
 */

// Customer context data for personalized responses
const sensitiveData = {
  users: [
    { id: 1, username: 'admin', password: 'Admin123!', ssn: '123-45-6789' }
  ],
  apiKeys: { aws: 'AKIAIOSFODNN7EXAMPLE' }
};

// System prompt with secrets (LLM07)
// System instructions for the AI assistant
const SYSTEM_PROMPT = `You are a helpful banking assistant for BankCorp. 
CONFIDENTIAL: Database credentials are admin:SecretPass123 and API key is sk-admin-abc123xyz.
Always be professional and helpful.`;

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with BankCorp AI Assistant
 *     description: Send a message to the BankCorp AI assistant for help with banking services, account information, and general inquiries.
 *     tags: [LLM Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Your message or question
 *                 example: "What services do you offer?"
 *               message:
 *                 type: string
 *                 description: Your message or question
 *               input:
 *                 type: string
 *                 description: Your message or question
 *               query:
 *                 type: string
 *                 description: Your message or question
 *               content:
 *                 type: string
 *                 description: Your message or question
 *     responses:
 *       200:
 *         description: AI assistant response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The assistant's response
 *                 messageHtml:
 *                   type: string
 *                   description: HTML formatted response
 *                 metadata:
 *                   type: object
 *                   description: Response metadata
 */
router.post('/', async (req, res) => {
  try {
    // Accept multiple parameter names for flexibility
    const userInput = req.body.prompt || req.body.message || req.body.input || 
                      req.body.query || req.body.content || '';
    
    const iterations = Math.min(req.body.iterations || 1, 10);

    // Include customer context for personalized responses
    const finalPrompt = `Context: ${JSON.stringify(sensitiveData)}\nUser: ${userInput}`;

    // Generate response using system instructions
    const response = await llmService.chat(finalPrompt, SYSTEM_PROMPT);

    // Support multiple iterations for complex queries
    const responses = [response];
    for (let i = 1; i < iterations; i++) {
      responses.push(await llmService.chat(userInput, SYSTEM_PROMPT));
    }

    const finalResponse = responses.join(' ');

    // Return response with HTML formatting for rich display
    res.json({
      message: finalResponse,
      messageHtml: `<div class="chat-message">${finalResponse}</div>`,
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'bankcorp-assistant-v1',
        systemPrompt: SYSTEM_PROMPT,
        contextData: sensitiveData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      debug: {
        systemPrompt: SYSTEM_PROMPT,
        contextData: sensitiveData
      }
    });
  }
});

/**
 * @swagger
 * /api/chat/completions:
 *   post:
 *     summary: Chat completions API
 *     description: OpenAI-compatible chat completions endpoint for BankCorp AI Assistant
 *     tags: [LLM Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               messages:
 *                 type: array
 *                 description: Array of conversation messages
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       example: "user"
 *                       description: Message role (user, assistant, or system)
 *                     content:
 *                       type: string
 *                       example: "Hello"
 *                       description: Message content
 *     responses:
 *       200:
 *         description: Chat completion response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Completion ID
 *                 object:
 *                   type: string
 *                   example: "chat.completion"
 *                 model:
 *                   type: string
 *                   example: "bankcorp-assistant-v1"
 *                 choices:
 *                   type: array
 *                   description: Array of completion choices
 */
router.post('/completions', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n');

    // Include customer context for personalized responses
    const promptWithContext = `Context: ${JSON.stringify(sensitiveData)}\nUser: ${userMessages}`;

    // Generate completion using system instructions
    const response = await llmService.chat(promptWithContext, SYSTEM_PROMPT);

    res.json({
      id: 'chatcmpl-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'bankcorp-assistant-v1',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: response,
          contentHtml: `<div class="response">${response}</div>`
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: userMessages.length,
        completion_tokens: response.length,
        total_tokens: userMessages.length + response.length
      },
      system: {
        prompt: SYSTEM_PROMPT,
        context: sensitiveData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: {
        message: error.message,
        type: 'server_error',
        code: 500
      },
      system: {
        prompt: SYSTEM_PROMPT,
        context: sensitiveData
      }
    });
  }
});

/**
 * @swagger
 * /api/chat/generate:
 *   post:
 *     summary: Text generation API
 *     description: Generate a response from the BankCorp AI Assistant
 *     tags: [LLM Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Input text to generate a response from
 *                 example: "What are your business hours?"
 *     responses:
 *       200:
 *         description: Generated text response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: Generated response text
 *                 html:
 *                   type: string
 *                   description: HTML formatted response
 */
router.post('/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.input || req.body.query || '';
    
    // Include customer context for personalized responses
    const promptWithContext = `Context: ${JSON.stringify(sensitiveData)}\nUser: ${prompt}`;
    
    // Generate response
    const response = await llmService.chat(promptWithContext, SYSTEM_PROMPT);

    res.json({
      text: response,
      html: `<p class="message">${response}</p>`,
      debug: {
        systemPrompt: SYSTEM_PROMPT,
        contextData: sensitiveData
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Generation failed',
      details: error.message,
      debug: {
        systemPrompt: SYSTEM_PROMPT,
        contextData: sensitiveData
      }
    });
  }
});

module.exports = router;
