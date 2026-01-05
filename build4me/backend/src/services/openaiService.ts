import OpenAI from 'openai';
import { CarpentryProjectRequest, CarpentryProjectResponse, Part, Step } from '../types';

/**
 * Gets or creates the OpenAI client instance
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

/**
 * Generates a carpentry project plan using GPT
 */
export async function generateProjectPlan(
  request: CarpentryProjectRequest
): Promise<CarpentryProjectResponse> {
  const prompt = buildPrompt(request);
  const openai = getOpenAIClient();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert carpenter and woodworking instructor. Your task is to provide detailed, accurate, and safe step-by-step instructions for building carpentry projects. You must also provide accurate part lists with realistic prices and purchase links. Always prioritize safety in your instructions.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    return validateAndFormatResponse(parsedResponse, request);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate project plan');
  }
}

function buildPrompt(request: CarpentryProjectRequest): string {
  let prompt = `Create a detailed carpentry project plan for the following request:\n\n`;

  prompt += `Project Type: ${request.projectType}\n`;

  if (request.dimensions) {
    const dims = request.dimensions;
    prompt += `Dimensions: `;
    const dimParts: string[] = [];
    if (dims.length) dimParts.push(`Length: ${dims.length}${dims.unit || 'in'}`);
    if (dims.width) dimParts.push(`Width: ${dims.width}${dims.unit || 'in'}`);
    if (dims.height) dimParts.push(`Height: ${dims.height}${dims.unit || 'in'}`);
    prompt += dimParts.join(', ') + '\n';
  }

  if (request.material) {
    prompt += `Preferred Material: ${request.material}\n`;
  }

  if (request.budget) {
    prompt += `Budget: $${request.budget}\n`;
  }

  if (request.skillLevel) {
    prompt += `Skill Level: ${request.skillLevel}\n`;
  }

  if (request.additionalRequirements) {
    prompt += `Additional Requirements: ${request.additionalRequirements}\n`;
  }

  prompt += `\nPlease provide a comprehensive response in JSON format with the following structure:
{
  "projectName": "Name of the project",
  "overview": "Brief overview of the project",
  "estimatedTotalCost": 0.00,
  "currency": "USD",
  "estimatedTotalTime": "X hours/days",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed description of what to do in this step",
      "tools": ["list", "of", "tools", "needed"],
      "materials": ["list", "of", "materials", "needed"],
      "estimatedTime": "X minutes/hours",
      "warnings": ["any safety warnings or important notes"]
    }
  ],
  "parts": [
    {
      "name": "Part name",
      "quantity": 1,
      "price": 0.00,
      "currency": "USD",
      "link": "https://example.com/product-link",
      "description": "Description of the part",
      "alternatives": [
        {
          "name": "Alternative part name",
          "quantity": 1,
          "price": 0.00,
          "currency": "USD",
          "link": "https://example.com/alternative-link",
          "description": "Description of alternative"
        }
      ]
    }
  ],
  "tools": ["list", "of", "all", "tools", "needed"],
  "tips": ["helpful tips for the project"]
}

Important requirements:
1. Provide realistic prices in USD for all parts (use current market prices)
2. Include actual purchase links to reputable retailers (Home Depot, Lowe's, Amazon, etc.)
3. Ensure all steps are clear, safe, and actionable
4. Include safety warnings where appropriate
5. Provide alternatives for major parts (like PC Part Picker does)
6. Make sure the total cost matches the sum of all parts
7. Be specific about quantities needed
8. Include all necessary hardware (screws, nails, glue, etc.)`;

  return prompt;
}

function validateAndFormatResponse(
  parsed: any,
  request: CarpentryProjectRequest
): CarpentryProjectResponse {
  // Validate and format the response
  const response: CarpentryProjectResponse = {
    projectName: parsed.projectName || request.projectType || 'Carpentry Project',
    overview: parsed.overview || 'A custom carpentry project',
    estimatedTotalCost: parsed.estimatedTotalCost || 0,
    currency: parsed.currency || 'USD',
    estimatedTotalTime: parsed.estimatedTotalTime || 'Unknown',
    steps: Array.isArray(parsed.steps)
      ? parsed.steps.map((step: any, index: number) => ({
          stepNumber: step.stepNumber || index + 1,
          title: step.title || `Step ${index + 1}`,
          description: step.description || '',
          tools: Array.isArray(step.tools) ? step.tools : [],
          materials: Array.isArray(step.materials) ? step.materials : [],
          estimatedTime: step.estimatedTime,
          warnings: Array.isArray(step.warnings) ? step.warnings : [],
        }))
      : [],
    parts: Array.isArray(parsed.parts)
      ? parsed.parts.map((part: any) => ({
          name: part.name || 'Unknown Part',
          quantity: part.quantity || 1,
          price: part.price || 0,
          currency: part.currency || 'USD',
          link: part.link || '',
          description: part.description || '',
          alternatives: Array.isArray(part.alternatives)
            ? part.alternatives.map((alt: any) => ({
                name: alt.name || 'Unknown',
                quantity: alt.quantity || 1,
                price: alt.price || 0,
                currency: alt.currency || 'USD',
                link: alt.link || '',
                description: alt.description || '',
              }))
            : [],
        }))
      : [],
    tools: Array.isArray(parsed.tools) ? parsed.tools : [],
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
  };

  // Recalculate total cost if needed
  if (response.parts.length > 0) {
    const calculatedTotal = response.parts.reduce(
      (sum, part) => sum + part.price * part.quantity,
      0
    );
    if (response.estimatedTotalCost === 0 || Math.abs(response.estimatedTotalCost - calculatedTotal) > 1) {
      response.estimatedTotalCost = calculatedTotal;
    }
  }

  return response;
}

