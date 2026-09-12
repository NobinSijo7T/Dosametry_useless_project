# Deployment Guide - Dosametry

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Free Tier)

**Best for:** Next.js apps, automatic deployments, zero configuration

#### Steps:

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Your Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm install -g vercel
   
   # Deploy from command line
   cd dosa-analyzer
   vercel
   ```

   Or use the web dashboard:
   - Click "New Project"
   - Import `Dosametry_useless_project`
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Handle the U-2-Net Model (170MB)**

   **Problem:** The model is too large for Git and Vercel's deployment size limits.

   **Solution A: Host Model on External CDN**
   
   Upload `model.onnx` to:
   - **Google Drive** (make public, get direct download link)
   - **Cloudflare R2** (free 10GB/month)
   - **AWS S3** (pay per use)
   - **GitHub Releases** (max 2GB per file)

   Then update your code to download from URL:

   ```typescript
   // lib/u2net.ts
   const MODEL_URL = 'https://your-cdn.com/model.onnx';
   
   export async function loadModel() {
     const session = await ort.InferenceSession.create(MODEL_URL);
     return session;
   }
   ```

   **Solution B: Vercel Blob Storage**
   
   ```bash
   npm install @vercel/blob
   ```

   Upload model:
   ```bash
   # Upload via Vercel dashboard or CLI
   vercel blob upload public/U-2-Net/onnx/model.onnx
   ```

   Update code:
   ```typescript
   import { put, get } from '@vercel/blob';
   
   const MODEL_URL = await get('model.onnx');
   ```

4. **Environment Variables**
   
   In Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_MODEL_URL=https://your-cdn.com/model.onnx
   ```

5. **Build Settings** (Auto-detected)
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

6. **Deploy**
   - Every push to `main` branch auto-deploys
   - Get URL: `https://dosametry.vercel.app`

---

### Option 2: Netlify (Alternative)

**Best for:** Generous free tier, easy setup

#### Steps:

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git → Choose `Dosametry_useless_project`

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Handle Model** (same as Vercel - use CDN)

4. **Deploy**
   - Auto-deploys on push
   - Get URL: `https://dosametry.netlify.app`

---

### Option 3: Self-Hosted (VPS/Cloud)

**Best for:** Full control, custom domain, no size limits

#### Requirements:
- VPS (DigitalOcean, AWS EC2, Google Cloud, Azure)
- Node.js 18+
- Nginx (reverse proxy)

#### Steps:

1. **Set up VPS**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Clone and Build**
   ```bash
   git clone https://github.com/NobinSijo7T/Dosametry_useless_project.git
   cd Dosametry_useless_project
   npm install
   
   # Place model file
   mkdir -p public/U-2-Net/onnx
   # Upload model.onnx to public/U-2-Net/onnx/model.onnx
   
   npm run build
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "dosametry" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/dosametry
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/dosametry /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 4: Docker Deployment

**Best for:** Containerized deployment, Kubernetes, cloud platforms

#### Dockerfile:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Download model at build time or runtime
# Option: Add wget command here to download model

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Deploy:

```bash
# Build image
docker build -t dosametry .

# Run container
docker run -p 3000:3000 dosametry

# Or use Docker Compose
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_MODEL_URL=${MODEL_URL}
    volumes:
      - ./public/U-2-Net:/app/public/U-2-Net
```

---

## 🧠 U-2-Net Model Deployment Strategies

### Strategy 1: CDN Hosting (Recommended)

**Upload to GitHub Releases:**
```bash
# Create a release and attach model.onnx
gh release create v1.0.0 public/U-2-Net/onnx/model.onnx
```

**Get download URL:**
```
https://github.com/NobinSijo7T/Dosametry_useless_project/releases/download/v1.0.0/model.onnx
```

### Strategy 2: Google Drive Public Link

1. Upload `model.onnx` to Google Drive
2. Right-click → Share → Anyone with link
3. Get sharing link: `https://drive.google.com/file/d/FILE_ID/view`
4. Convert to direct download: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Strategy 3: Cloudflare R2 (Free 10GB)

```bash
# Install Wrangler CLI
npm install -g wrangler

# Upload
wrangler r2 object put dosametry-models/model.onnx --file=./model.onnx

# Get public URL
# Configure R2 public access in Cloudflare dashboard
```

### Strategy 4: AWS S3

```bash
# Install AWS CLI
pip install awscli

# Upload
aws s3 cp model.onnx s3://dosametry-models/model.onnx --acl public-read

# URL: https://dosametry-models.s3.amazonaws.com/model.onnx
```

---

## 📦 Backend API (if needed)

Your app is currently 100% client-side. If you need a backend:

### Option A: Next.js API Routes (Already Available)

```typescript
// app/api/analyze/route.ts
export async function POST(request: Request) {
  const { image } = await request.json();
  
  // Process on server-side if needed
  const result = await analyzeImage(image);
  
  return Response.json(result);
}
```

### Option B: Separate Backend (Node.js/Express)

```bash
# Create backend folder
mkdir backend
cd backend
npm init -y
npm install express cors onnxruntime-node sharp
```

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const ort = require('onnxruntime-node');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  // Server-side analysis
  const session = await ort.InferenceSession.create('./model.onnx');
  // ... process image
  res.json({ result });
});

app.listen(3001, () => console.log('Backend on 3001'));
```

Deploy backend separately:
- **Railway**: `railway up`
- **Render**: Connect repo, deploy
- **Heroku**: `git push heroku main`

---

## 🔒 Environment Variables

Create `.env.local` (don't commit):

```bash
# Model hosting
NEXT_PUBLIC_MODEL_URL=https://your-cdn.com/model.onnx

# Sarvam API (if using)
SARVAM_API_KEY=your_sarvam_key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🎯 Recommended Setup

**For this project, I recommend:**

1. **Frontend**: Deploy to **Vercel** (free, automatic)
2. **Model**: Host on **GitHub Releases** (free, reliable)
3. **Processing**: Keep **client-side** (no backend costs)

**Steps:**

```bash
# 1. Upload model to GitHub Releases
gh release create v1.0.0 public/U-2-Net/onnx/model.onnx

# 2. Update model URL in code
# lib/u2net.ts - change model path to release URL

# 3. Deploy to Vercel
vercel

# 4. Done! Your app is live
```

---

## 📊 Free Tier Limits

| Platform | Storage | Bandwidth | Build Time |
|----------|---------|-----------|------------|
| Vercel | 100GB | 100GB/mo | 6000 min/mo |
| Netlify | 100GB | 100GB/mo | 300 min/mo |
| Cloudflare R2 | 10GB | 10GB/mo | N/A |
| GitHub Releases | 2GB/file | Unlimited | N/A |

---

## 🐛 Common Issues

### Issue 1: Model file too large
**Solution:** Use CDN hosting (see strategies above)

### Issue 2: Build timeout
**Solution:** Exclude model from build, load at runtime

### Issue 3: CORS errors
**Solution:** Configure proper CORS headers on model CDN

### Issue 4: Memory errors
**Solution:** Use server-side processing for large files

---

## 📝 Deployment Checklist

- [ ] Remove `.env.local` from git
- [ ] Update model URL to CDN
- [ ] Test build locally: `npm run build`
- [ ] Configure environment variables
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS/SSL
- [ ] Test on mobile devices
- [ ] Monitor performance
- [ ] Set up error tracking (Sentry)

---

**Need help with deployment? Contact the team!**
