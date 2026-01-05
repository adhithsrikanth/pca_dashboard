import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateProjectPlan } from './services/openaiService';
import { CarpentryProjectRequest } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'BuildAnything API is running' });
});

// Main API endpoint for generating carpentry project plans
app.post('/api/project-plan', async (req: Request, res: Response) => {
  try {
    // Validate request body
    if (!req.body || !req.body.projectType) {
      return res.status(400).json({
        error: 'Missing required field: projectType',
        message: 'Please provide at least a projectType in the request body',
      });
    }

    const projectRequest: CarpentryProjectRequest = req.body;

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set in environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'OpenAI API key is not configured',
      });
    }

    // Generate project plan using GPT
    const projectPlan = await generateProjectPlan(projectRequest);

    // Return the project plan
    res.json({
      success: true,
      data: projectPlan,
    });
  } catch (error: any) {
    console.error('Error generating project plan:', error);
    res.status(500).json({
      error: 'Failed to generate project plan',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BuildAnything API server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔨 Project plan endpoint: http://localhost:${PORT}/api/project-plan`);
});

