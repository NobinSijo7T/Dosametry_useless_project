# 🚀 Quick Start: Amma Mode & Passport

## Test in 3 Steps

### 1. Start the App
```bash
cd dosa-analyzer
npm run dev
```

### 2. Upload & Analyze
- Open http://localhost:3000
- Upload a dosa image (or use a sample)
- Wait for analysis to complete

### 3. Test Features

#### Amma Mode (Automatic)
- **Appears below the main results**
- **Malayalam is default** (മലയാളം)
- **Click language buttons** to switch:
  - മലയാളം (Malayalam)
  - Manglish
  - English
- **Watch approval score animate**
- **Read the verdict** - it changes with language!

#### Dosa Passport
- **Click "📋 Generate Dosa Passport"** button
- **View the official document**
- **Click "🖨️ Print / Save as PDF"**
- **Browser print dialog opens**
- **Save as PDF** or print directly

---

## What to Verify

### ✅ Deterministic Behavior
Upload the same dosa twice → Same approval score both times

### ✅ Language Switching
Switch between മലയാളം / Manglish / English → Verdict text changes immediately

### ✅ Print Quality
Print preview → Malayalam text displays correctly, layout fits A4

### ✅ Privacy
Check Network tab → No image uploads, no API calls

---

## Fixed Issues

### WebGPU MaxPool Error
**Fixed!** WASM backend is now prioritized. No more console errors.

### Malayalam Font
**Working!** Marcellus font loaded, Malayalam Unicode supported.

### Passport Layout
**Optimized!** A4 paper, proper margins, colors preserved in print.

---

## Key Files

```
components/
├── AmmaMode.tsx          ← Language selector & verdict display
├── DosaPassport.tsx      ← Print-ready passport
└── ResultsPanel.tsx      ← Integrates both components

lib/
├── ammaVerdict.ts        ← Deterministic verdict engine
└── specimenId.ts         ← DOSA-XXXX-XXXX generator

app/
└── globals.css           ← Print CSS + animations
```

---

## Troubleshooting

### No Amma Mode appears
- Verify analysis completed successfully
- Check console for errors
- Ensure `result.geometry` exists

### Passport won't print
- Check browser print settings
- Verify print CSS loaded
- Try different browser

### Wrong language shows
- Default is Malayalam (മലയാളം)
- Click language button to switch
- Verdict updates immediately

---

**Ready to test!** 🎉
