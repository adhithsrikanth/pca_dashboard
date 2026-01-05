# Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

**Option A: Install all at once (from root)**
```bash
npm run install:all
```

**Option B: Install separately**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend Configuration:**
```bash
cd backend
cp .env.example .env
# Edit .env and add your OpenAI API key
```

Required in `backend/.env`:
- `OPENAI_API_KEY` - Your OpenAI API key (required)

**Frontend Configuration (Optional):**
```bash
cd frontend
# Create .env file if you want to customize API URL
echo "VITE_API_BASE_URL=http://localhost:3001" > .env
```

### 3. Start the Application

**Option A: Run both servers (from root)**
```bash
# Install concurrently first if not already installed
npm install -g concurrently
# Or use npx
npx concurrently "npm run dev:backend" "npm run dev:frontend"
```

**Option B: Run in separate terminals**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Troubleshooting

### Backend won't start
- Check that `OPENAI_API_KEY` is set in `backend/.env`
- Ensure port 3001 is not in use
- Check Node.js version (requires 18+)

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` in frontend `.env` if set

### API calls failing
- Verify OpenAI API key is valid
- Check backend logs for errors
- Ensure you have OpenAI API credits

## Development Tips

- Backend hot-reloads automatically with `npm run dev`
- Frontend hot-reloads automatically with `npm run dev`
- Check browser console and terminal for errors
- Backend logs API requests and errors

