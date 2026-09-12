# U-2-Net Model Setup for Production

## Quick Fix for Railway Deployment

Your app is deployed but needs the U-2-Net model (170MB) hosted on a CDN.

---

## Option 1: GitHub Releases (Recommended - Free)

### Step 1: Upload Model to GitHub Releases

```bash
# Using GitHub CLI (gh)
gh release create v1.0.0 \
  --title "Dosametry v1.0.0 - U-2-Net Model" \
  --notes "U-2-Net ONNX model for dosa segmentation" \
  public/U-2-Net/onnx/model.onnx
```

Or manually:
1. Go to https://github.com/NobinSijo7T/Dosametry_useless_project/releases
2. Click **"Draft a new release"**
3. Tag: `v1.0.0`
4. Title: "Dosametry v1.0.0 - U-2-Net Model"
5. Drag `model.onnx` file to attach
6. Click **"Publish release"**

### Step 2: Get Download URL

After publishing, right-click the model file → Copy link

URL format:
```
https://github.com/NobinSijo7T/Dosametry_useless_project/releases/download/v1.0.0/model.onnx
```

### Step 3: Set Environment Variable in Railway

```bash
# Via CLI
railway variables set NEXT_PUBLIC_MODEL_URL=https://github.com/NobinSijo7T/Dosametry_useless_project/releases/download/v1.0.0/model.onnx

# Or via Railway Dashboard:
# Project → Settings → Variables → Add Variable
# Name: NEXT_PUBLIC_MODEL_URL
# Value: https://github.com/.../model.onnx
```

### Step 4: Redeploy

Railway will automatically redeploy with the new environment variable.

---

## Option 2: Google Drive

### Step 1: Upload to Google Drive

1. Upload `model.onnx` to your Google Drive
2. Right-click → Share → Anyone with link
3. Copy the share link

### Step 2: Convert to Direct Download URL

Share link format:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Convert to direct download:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

### Step 3: Set in Railway

```bash
railway variables set NEXT_PUBLIC_MODEL_URL=https://drive.google.com/uc?export=download&id=FILE_ID
```

---

## Option 3: Cloudflare R2 (Free 10GB)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create R2 Bucket

```bash
wrangler r2 bucket create dosametry-models
```

### Step 3: Upload Model

```bash
wrangler r2 object put dosametry-models/model.onnx \
  --file=public/U-2-Net/onnx/model.onnx \
  --content-type=application/octet-stream
```

### Step 4: Enable Public Access

1. Go to Cloudflare Dashboard → R2
2. Select `dosametry-models` bucket
3. Settings → Public Access → Enable
4. Get public URL: `https://pub-xxxxx.r2.dev/model.onnx`

### Step 5: Set in Railway

```bash
railway variables set NEXT_PUBLIC_MODEL_URL=https://pub-xxxxx.r2.dev/model.onnx
```

---

## Verify Model Loading

After setting the URL and redeploying:

1. Open your app: https://dosa-analyzer-production.up.railway.app
2. Open browser DevTools (F12) → Console
3. Upload a dosa image
4. You should see: `[U-2-Net] Successfully initialized via WASM from CDN...`

---

## Troubleshooting

### Error: "Failed to load model from CDN"

**Check:**
- URL is publicly accessible (test in browser)
- CORS headers allow cross-origin requests
- File size is correct (~176MB)

**Test URL:**
```bash
curl -I https://your-cdn-url.com/model.onnx
```

Should return:
```
HTTP/2 200
content-type: application/octet-stream
content-length: 176636000
access-control-allow-origin: *
```

### Error: "CORS policy blocked"

Add CORS headers to your CDN:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

For GitHub Releases: CORS is enabled by default ✅

---

## Performance Notes

- **First load:** Model downloads (~170MB) - takes 5-30 seconds
- **Cached:** Browser caches model - instant subsequent loads
- **CDN:** Use GitHub Releases or Cloudflare R2 for best performance

---

## Cost Comparison

| Option | Storage | Bandwidth | Cost |
|--------|---------|-----------|------|
| GitHub Releases | 2GB/file | Unlimited | FREE |
| Google Drive | 15GB free | Limited | FREE |
| Cloudflare R2 | 10GB free | 10GB/mo | FREE then $0.015/GB |
| AWS S3 | Pay per use | Pay per use | ~$0.023/GB |

**Recommendation:** Use **GitHub Releases** for simplicity and reliability.
