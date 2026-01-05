# Build4Me - Carpentry Project Planner

A full-stack application that helps users plan and estimate carpentry projects. The application uses AI (OpenAI GPT) to generate detailed project plans, material lists, step-by-step instructions, and cost estimates.

## 🏗️ Project Structure

```
build4me/
├── backend/          # Express.js API server with OpenAI integration
├── frontend/         # React + TypeScript + Vite frontend
└── README.md         # This file
```

## ✨ Features

- **Interactive Project Planning**: Multi-step form to collect project requirements
- **AI-Powered Planning**: Uses OpenAI GPT to generate comprehensive project plans
- **Detailed Material Lists**: Complete parts list with prices and purchase links
- **Step-by-Step Instructions**: Detailed building instructions with tools and materials per step
- **Cost Estimation**: Accurate cost estimates with alternative part options
- **Safety Warnings**: Important safety information included in instructions
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd build4me
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Set up the frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:8080`

Open your browser and navigate to `http://localhost:8080`

## 📁 Project Details

### Backend (`/backend`)

- **Framework**: Express.js with TypeScript
- **AI Integration**: OpenAI GPT-4 Turbo
- **API Endpoints**:
  - `POST /api/project-plan` - Generate project plan
  - `GET /health` - Health check

See [backend/README.md](./backend/README.md) for more details.

### Frontend (`/frontend`)

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **State Management**: React Context API

See [frontend/README.md](./frontend/README.md) for more details.

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:3001
```

If not set, the frontend will default to `http://localhost:3001`.

## 📝 Usage

1. **Start the application** (see Quick Start above)

2. **Enter Project Details**:
   - Describe your project
   - Select project type
   - Enter dimensions
   - Choose materials and preferences

3. **Review & Generate**:
   - Review your project details
   - Click "Generate Materials List"
   - Wait for AI to generate your plan

4. **View Results**:
   - See complete material list with prices
   - Review step-by-step instructions
   - Check required tools and tips

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev      # Start with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend Development

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📦 Tech Stack

### Backend
- Express.js
- TypeScript
- OpenAI API
- CORS
- dotenv

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- React Hook Form
- Zod

## 🤝 Contributing

This is a cohesive full-stack project. When making changes:

1. Ensure backend API changes are reflected in frontend types
2. Update both README files if needed
3. Test the full flow: frontend → backend → OpenAI → response → frontend

## 📄 License

MIT

## 🙏 Acknowledgments

- OpenAI for GPT API
- shadcn/ui for beautiful UI components
- The open-source community
