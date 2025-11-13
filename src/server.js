require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Import unified vulnerable chat route (OWASP LLM Top 10 2025)
const chatRoutes = require('./routes/chat'); // All LLM vulnerabilities in realistic chat format

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '1mb' })); // Limit request body size
app.use(morgan('tiny')); // Minimal logging for better performance

// VULNERABLE: No rate limiting
// VULNERABLE: No input validation middleware
// VULNERABLE: No authentication on most endpoints

// Serve OpenAPI spec as JSON
app.get('/api-spec', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Serve Swagger UI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Vulnerable AI App - API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '/favicon.ico'
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information and available endpoints
 *     description: Returns information about the Vulnerable AI Application and all available OWASP LLM Top 10 2025 endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 warning:
 *                   type: string
 *                 version:
 *                   type: string
 *                 endpoints:
 *                   type: object
 *                 documentation:
 *                   type: string
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Vulnerable AI Application - OWASP LLM Top 10 2025 Demo',
    warning: '⚠️ This application is intentionally vulnerable for educational purposes',
    version: 'OWASP LLM Top 10 2025 Edition - StackHawk Testable Vulnerabilities',
    endpoints: {
      'Primary': '/api/chat - Unified vulnerable chat endpoint (all LLM vulnerabilities)',
      'Alternative': '/api/chat/completions - OpenAI-style completions',
      'Simple': '/api/chat/generate - Simple generation endpoint',
      'Vulnerabilities': 'LLM01, LLM02, LLM05, LLM07, LLM10 - All demonstrated through chat interface'
    },
    documentation: {
      readme: 'See README.md for exploitation examples',
      openapi: '/api-spec - OpenAPI 3.0 specification (JSON)',
      swagger: '/api-docs - Interactive API documentation'
    }
  });
});

// Mount unified vulnerable chat route (realistic LLM application pattern)
app.use('/api/chat', chatRoutes); // All OWASP LLM vulnerabilities: LLM01, LLM02, LLM05, LLM07, LLM10

// VULNERABLE: Detailed error messages expose system information
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    environment: process.env,
    systemInfo: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: process.memoryUsage()
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚨 Vulnerable AI App running on http://localhost:${PORT}`);
  console.log(`⚠️  WARNING: This application contains intentional vulnerabilities`);
  console.log(`📚 Use only for educational purposes in isolated environments`);
});
