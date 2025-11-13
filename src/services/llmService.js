const axios = require('axios');

const LLM_API_URL = process.env.LLM_API_URL || 'http://localhost:11434';
const LLM_MODEL = process.env.LLM_MODEL || 'llama2';

/**
 * VULNERABLE LLM Service
 * Contains multiple security issues for educational purposes
 */
class LLMService {
  
  /**
   * VULNERABLE: Direct prompt injection without sanitization
   */
  async chat(userPrompt, systemPrompt = null) {
    try {
      const prompt = systemPrompt 
        ? `${systemPrompt}\n\nUser: ${userPrompt}`
        : userPrompt;

      const response = await axios.post(`${LLM_API_URL}/api/generate`, {
        model: LLM_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
          num_predict: parseInt(process.env.MAX_TOKENS) || 15
        }
      }, {
        timeout: 30000 // 30 second timeout for LLM calls
      });

      return response.data.response;
    } catch (error) {
      throw new Error(`LLM Error: ${error.message}`);
    }
  }

  /**
   * Check if LLM backend is available
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${LLM_API_URL}/api/tags`);
      return { status: 'healthy', models: response.data.models };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new LLMService();
