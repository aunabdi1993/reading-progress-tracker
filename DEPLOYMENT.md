# Deployment Guide

## Vercel Deployment (Frontend)

This project uses a monorepo structure with the frontend in the `frontend/` directory. Follow these steps to deploy successfully on Vercel.

### Option 1: Using Vercel Dashboard (Recommended)

1. **Import your GitHub repository** in Vercel

2. **Configure the project settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Set Environment Variables**:
   - Add `NEXT_PUBLIC_API_URL` with your backend API URL
   - For production: `https://your-backend-api.com`
   - For development: `http://localhost:8000`

4. **Deploy**: Click "Deploy" and Vercel will build and deploy your frontend

### Option 2: Using vercel.json (Current Setup)

A `vercel.json` file has been created at the root level with the following configuration:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install --prefix frontend",
  "devCommand": "cd frontend && npm run dev"
}
```

**Steps to deploy**:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the root directory:
```bash
vercel
```

4. Set environment variables:
```bash
vercel env add NEXT_PUBLIC_API_URL
```

5. Deploy to production:
```bash
vercel --prod
```

### Troubleshooting 404 Errors

If you're getting a 404 error on your Vercel deployment, check these common issues:

#### 1. **Wrong Root Directory**
- Go to your Vercel project settings
- Navigate to "General" → "Root Directory"
- Ensure it's set to `frontend` or the `vercel.json` is properly configured

#### 2. **Build Errors**
- Check the deployment logs in Vercel dashboard
- Look for any build failures or errors
- Ensure all dependencies are in `frontend/package.json`

#### 3. **Missing Environment Variables**
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Go to Settings → Environment Variables
- Add the variable for Production, Preview, and Development

#### 4. **Framework Detection**
- Vercel should auto-detect Next.js
- If not, manually set Framework Preset to "Next.js" in settings

#### 5. **Output Directory Mismatch**
- The output directory should be `.next` (or `frontend/.next` if root is project root)
- Check in Settings → General → Build & Development Settings

### Verifying the Deployment

After deploying, verify these URLs work:
- Main page: `https://your-app.vercel.app/`
- Next.js API routes (if any): `https://your-app.vercel.app/api/...`

### Backend Deployment

The FastAPI backend needs to be deployed separately. Consider these options:

1. **Render.com**
   - Free tier available
   - Native Python support
   - Easy database integration

2. **Railway.app**
   - Simple deployment
   - PostgreSQL database included
   - Good for FastAPI apps

3. **Fly.io**
   - Free tier with generous limits
   - Good performance
   - Docker-based deployment

4. **DigitalOcean App Platform**
   - Managed platform
   - Easy scaling
   - Database options

### Full Stack Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to hosting service
- [ ] Database set up (PostgreSQL recommended for production)
- [ ] Environment variables configured on both services
- [ ] CORS settings updated in backend to allow Vercel domain
- [ ] API URL updated in frontend environment variables
- [ ] SSL/HTTPS enabled on both services
- [ ] Custom domain configured (optional)

### Environment Variables Reference

**Frontend (Vercel)**:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

**Backend (Hosting Service)**:
```
DATABASE_URL=postgresql://user:password@host:port/database
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Updating CORS for Production

Once you have your Vercel URL, update the backend `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to the `main` branch
- **Preview**: Pull requests and other branches

To disable auto-deployment for specific branches, configure in Vercel dashboard under:
Settings → Git → Ignored Build Step

### Getting Help

If you continue to experience issues:

1. Check Vercel deployment logs: Project → Deployments → Click on deployment → View Build Logs
2. Check Vercel runtime logs: Project → Deployments → Click on deployment → View Function Logs
3. Verify the build works locally: `cd frontend && npm run build`
4. Check Vercel documentation: https://vercel.com/docs

### Quick Fix Commands

```bash
# Redeploy on Vercel
vercel --prod --force

# Check build locally
cd frontend && npm run build

# Test production build locally
cd frontend && npm run build && npm run start

# Clear Next.js cache
cd frontend && rm -rf .next && npm run build
```