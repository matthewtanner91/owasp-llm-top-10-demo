const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BankCorp AI Assistant API',
      version: '1.0.0',
      description: 'RESTful API for the BankCorp AI Assistant. Provides natural language chat interface for customer support, account inquiries, and banking services.',
      contact: {
        name: 'BankCorp API Support',
        url: 'https://bankcorp.example.com/support'
      },
      license: {
        name: 'Proprietary',
        url: 'https://bankcorp.example.com/legal/api-terms'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development environment'
      },
      {
        url: 'https://api.bankcorp.example.com',
        description: 'Production API'
      }
    ],
    tags: [
      {
        name: 'General',
        description: 'API health and information endpoints'
      },
      {
        name: 'LLM Chat',
        description: 'AI-powered chat assistant for customer support and banking inquiries'
      }
    ],
    components: {
      schemas: {
        ChatRequest: {
          type: 'object',
          required: ['prompt'],
          properties: {
            prompt: {
              type: 'string',
              description: 'Customer message or inquiry',
              example: 'What are your business hours?'
            }
          }
        },
        ChatResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'AI assistant response text'
            },
            messageHtml: {
              type: 'string',
              description: 'HTML formatted response for rich display'
            },
            metadata: {
              type: 'object',
              description: 'Response metadata including timestamp and model information'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            message: {
              type: 'string',
              description: 'Detailed error description'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
