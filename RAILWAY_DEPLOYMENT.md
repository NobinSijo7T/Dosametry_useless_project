# Railway Deployment Guide - Dosametry

## 🚂 Deploy to Railway with Docker

Railway is perfect for deploying containerized Next.js apps with automatic HTTPS, custom domains, and zero DevOps.

---

## Prerequisites

- GitHub account with your repository
- Railway account (sign up at [railway.app](https://railway.app))
- Docker installed locally (for testing)

---

## Quick Deployment Steps

### 1. **Test Docker Build Locally**

```bash
# Build the Docker image
docker build -t dosametry .

# Run locally to test
docker run -p 3000:3000 dosametry

# Open browser to http://localhost:3000
```

### 2. **Deploy to Railway via GitHub**

#### Option A: Railway Dashboard (Easiest)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **`Dosametry_useless_project`**
6. Railway auto-detects Dockerfile ✅
7. Click **"Deploy Now"**

Railway will:
- ✅ Build your Docker image
- ✅ Deploy to production
- ✅ Provide a public URL: `https://dosametry-production.up.railway.app`

#### Option B: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your GitHub repo
railway link

# Deploy
railway up
```

### 3. **Configure Environment Variables**

In Railway dashboard → Your project → Variables:

```env
# Required
NODE_ENV=production
PORT=3000

# Model URL (if using external CDN)
NEXT_PUBLIC_MODEL_URL=https://github.com/.../releases/download/v1.0.0/model.onnx

# Optional: Sarvam API
SARVAM_API_KEY=your_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 4. **Add Custom Domain (Optional)**

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Add your domain: `dosametry.com`
4. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: <your-railway-domain>.up.railway.app
   ```

---

## 📦 What's Included in the Docker Image

The Dockerfile uses **multi-stage builds** for optimal size:

### Stage 1: Dependencies
- Installs production dependencies only
- Uses Alpine Linux (minimal size)

### Stage 2: Builder
- Builds Next.js with standalone output
- Optimizes for production

### Stage 3: Runner
- Creates minimal production image
- Runs as non-root user (security)
- Includes health check endpoint

**Final image size:** ~150-200MB (vs 1GB+ without optimization)

---

## 🔍 Health Check

Railway automatically monitors your app using the health check endpoint:

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-11T...",
  "service": "Dosametry",
  "version": "1.0.0"
}
```

---

## 🧠 Handling the U-2-Net Model (170MB)

**Problem:** Model is too large to include in Docker image.

### Solution 1: Download at Runtime (Recommended)

Update `lib/u2net.ts`:

```typescript
const MODEL_URL = process.env.NEXT_PUBLIC_MODEL_URL || 
  'https://github.com/NobinSijo7T/Dosametry_useless_project/releases/download/v1.0.0/model.onnx';

export async function loadModel() {
  // Model is cached by browser after first download
  const session = await ort.InferenceSession.create(MODEL_URL);
  return session;
}
```

**Advantages:**
- ✅ Smaller Docker image
- ✅ Faster deployments
- ✅ Model cached by browser
- ✅ Easy to update model without redeploying

### Solution 2: Include in Docker Image

If you want the model in the image:

```dockerfile
# Add after COPY . . in builder stage
RUN mkdir -p public/U-2-Net/onnx
RUN wget https://github.com/.../model.onnx -O public/U-2-Net/onnx/model.onnx
```

**Note:** This increases image size significantly.

---

## 🚀 Continuous Deployment

Railway auto-deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: Add new feature"
git push origin main

# Railway automatically:
# 1. Detects push
# 2. Builds new Docker image
# 3. Deploys to production
# 4. Zero downtime!
```

---

## 💰 Railway Pricing

### Hobby Plan (Free)
- $5 free credits/month
- Perfect for testing
- ~100 hours of uptime

### Pro Plan ($20/month)
- Unlimited usage
- Custom domains
- Higher resource limits
- Team collaboration

**Cost estimate for Dosametry:**
- ~$8-15/month for 24/7 uptime
- Includes 8GB RAM, 8 vCPU

---

## 📊 Monitoring & Logs

### View Logs
```bash
# Using CLI
railway logs

# Or in dashboard
Project → Deployments → View Logs
```

### Metrics
Railway provides:
- CPU usage
- Memory usage
- Network traffic
- Request count
- Response times

---

## 🐛 Troubleshooting

### Build Fails

**Check logs:**
```bash
railway logs --deployment <deployment-id>
```

**Common issues:**
- Missing dependencies → Check `package.json`
- Build timeout → Optimize Dockerfile
- Out of memory → Increase Railway plan

### App Crashes on Startup

**Check:**
1. Port configuration (must be 3000 or use `$PORT`)
2. Health check endpoint exists
3. Environment variables are set
4. Node version matches (18+)

### Slow First Load

**Solution:** Model is downloading from CDN
- Add loading state in UI
- Pre-warm the model
- Consider including in Docker image

---

## 🔐 Security Best Practices

### 1. Environment Variables
Never commit `.env.local`:
```bash
# Already in .gitignore
.env.local
```

### 2. Non-Root User
Dockerfile runs as `nextjs:nodejs` (not root) ✅

### 3. Health Check
Monitors app availability ✅

### 4. HTTPS
Railway provides automatic SSL ✅

---

## 📝 Deployment Checklist

Before deploying:

- [ ] Test Docker build locally
- [ ] Verify health endpoint works
- [ ] Set environment variables in Railway
- [ ] Test model loading from CDN
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/alerts
- [ ] Test on mobile devices
- [ ] Check CORS headers
- [ ] Verify SSL certificate

---

## 🎯 Alternative: Railway + GitHub Actions

For advanced CI/CD:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📞 Support

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Community Discord: [discord.gg/railway](https://discord.gg/railway)
- Status Page: [status.railway.app](https://status.railway.app)

---

## 🎉 Success!

Your Dosametry app should now be live at:
```
https://dosametry-production.up.railway.app
```

**Next Steps:**
1. Share the link with users
2. Monitor usage and performance
3. Add analytics (Google Analytics, Plausible)
4. Set up error tracking (Sentry)
5. Create a custom domain

---

**Made with ❤️ for TinkerHub Useless Projects**
