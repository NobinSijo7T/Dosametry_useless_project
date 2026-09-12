# Railway Build Troubleshooting - Node.js Version Issue

## Problem
Railway keeps using Node.js 18.20.8 instead of Node.js 20, causing build failures:
```
You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.
```

## Solutions (Try in Order)

### 1. Clear Build Cache (Recommended First)

**In Railway Dashboard:**
1. Go to your project
2. Click on your service
3. Go to **Settings** tab
4. Scroll to **Danger Zone**
5. Click **"Clear Build Cache"**
6. Go back to **Deployments** tab
7. Click **"Redeploy"**

### 2. Force Redeploy with New Commit

We've already done this by:
- ✅ Updated Dockerfile to use `node:20-alpine`
- ✅ Added `railway.json` with explicit Dockerfile config
- ✅ Added `.node-version` file
- ✅ Updated `package.json` engines field

Railway should auto-deploy the latest commit.

### 3. Manual Trigger via Dashboard

1. Go to Railway dashboard
2. Click your **Dosametry** project
3. Click **Deployments** tab
4. Click **"New Deployment"** or **⋮** (three dots) → **"Redeploy"**

### 4. Check Service Settings

Make sure Railway is using Dockerfile:

1. Go to **Settings** tab
2. Check **Builder** is set to **"Dockerfile"**
3. Check **Dockerfile Path** is `Dockerfile`

### 5. Delete and Recreate Service (Last Resort)

If nothing works:
1. Delete the current service in Railway
2. Create new service from GitHub
3. Railway will use the latest Dockerfile with Node 20

---

## Verification

After successful deployment, check:

```bash
# In Railway logs, you should see:
# ✓ Compiled successfully
# No "Node.js 18.20.8" error
```

---

## Files That Enforce Node.js 20

1. **Dockerfile** - All stages use `node:20-alpine`
2. **package.json** - `"engines": { "node": ">=20.9.0" }`
3. **.node-version** - Contains `20.18.1`
4. **.nvmrc** - Contains `20.18.1`
5. **railway.json** - Explicit Dockerfile builder config

---

## If Still Failing

Contact Railway support or check:
- Railway Status: https://status.railway.app
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

Share this error log with support:
```json
{
  "error": "Node.js 18.20.8 used instead of 20+",
  "expected": ">=20.9.0",
  "dockerfile": "Uses node:20-alpine",
  "issue": "Build cache or Nixpacks override"
}
```
