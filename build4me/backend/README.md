# BuildAnything Backend

Backend API server for generating detailed carpentry project plans with step-by-step instructions, part lists, prices, and purchase links using OpenAI GPT.

## Features

- 🪚 Generate comprehensive carpentry project plans
- 📋 Step-by-step building instructions
- 💰 Part pricing with purchase links
- 🔄 Alternative part options (similar to PC Part Picker)
- 🛠️ Tool and material lists
- ⚠️ Safety warnings and tips

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file in the root directory:**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or build and run in production:
   ```bash
   npm run build
   npm start
   ```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## API Endpoints

### POST `/api/project-plan`

Generate a carpentry project plan based on user requirements.

**Request Body:**
```json
{
  "projectType": "Coffee Table",
  "dimensions": {
    "length": 48,
    "width": 24,
    "height": 18,
    "unit": "in"
  },
  "material": "Oak",
  "budget": 200,
  "skillLevel": "Intermediate",
  "additionalRequirements": "Modern design with hairpin legs"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projectName": "Modern Oak Coffee Table",
    "overview": "A beautiful modern coffee table...",
    "estimatedTotalCost": 185.50,
    "currency": "USD",
    "estimatedTotalTime": "8-10 hours",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Cut the tabletop",
        "description": "Using a circular saw...",
        "tools": ["Circular saw", "Measuring tape"],
        "materials": ["Oak board"],
        "estimatedTime": "30 minutes",
        "warnings": ["Wear safety glasses"]
      }
    ],
    "parts": [
      {
        "name": "Oak Board 1x6x8",
        "quantity": 3,
        "price": 45.99,
        "currency": "USD",
        "link": "https://www.homedepot.com/p/...",
        "description": "Premium oak board",
        "alternatives": [
          {
            "name": "Pine Board 1x6x8",
            "quantity": 3,
            "price": 28.99,
            "currency": "USD",
            "link": "https://www.homedepot.com/p/...",
            "description": "Budget-friendly alternative"
          }
        ]
      }
    ],
    "tools": ["Circular saw", "Drill", "Sander"],
    "tips": ["Sand with the grain", "Pre-drill holes to prevent splitting"]
  }
}
```

### GET `/health`

Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "BuildAnything API is running"
}
```

## Project Structure

```
BuildAnything/
├── src/
│   ├── server.ts              # Express server setup
│   ├── types.ts               # TypeScript type definitions
│   └── services/
│       └── openaiService.ts   # OpenAI GPT integration
├── dist/                      # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `CORS_ORIGIN` | Allowed CORS origin | No | * |

## Frontend Integration

Your frontend should send a POST request to `http://localhost:3001/api/project-plan` with the project details. Example using fetch:

```javascript
const response = await fetch('http://localhost:3001/api/project-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    projectType: 'Coffee Table',
    dimensions: {
      length: 48,
      width: 24,
      height: 18,
      unit: 'in'
    },
    material: 'Oak',
    budget: 200,
    skillLevel: 'Intermediate',
  }),
});

const data = await response.json();
console.log(data.data); // Project plan
```

## Notes

- The API uses GPT-4 Turbo for generating project plans
- All prices are in USD by default
- Purchase links point to major retailers (Home Depot, Lowe's, Amazon, etc.)
- The API includes safety warnings and best practices
- Alternative parts are provided for major components

## License

MIT

