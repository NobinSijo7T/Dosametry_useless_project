# 🥞 Dosa Circularity Analyzer™ - Next.js Edition

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Status: Nobel Prize Pending](https://img.shields.io/badge/Status-Nobel%20Prize%20Pending-gold.svg)]()

> The world's most important scientific tool for analyzing dosa circularity. Now built with Next.js, TypeScript, and Tailwind CSS!

## 🎯 What is This?

The **Dosa Circularity Analyzer™** is a humorous web application that uses "cutting-edge" analysis to determine how circular your dosa is. Upload an image, get a score from 0-100%, and receive a comprehensive (and completely fake) scientific report.

**⚠️ Disclaimer**: This is a satirical project for entertainment purposes only. No real machine learning or AI is used. All scores are randomly generated. Not responsible for dosa-related emotional damage.

## ✨ Features

- 🔬 **"AI-Powered" Analysis** - Sophisticated algorithms that are actually just `Math.random()`
- 📊 **Comprehensive Scoring** - Get a circularity percentage and classification from "Platonic Ideal" to "Geometrical Crime"
- 🎨 **Beautiful CSS Dosa Art** - Pure CSS dosa illustrations with animations
- 📈 **Fake Metrics** - Roundness Index, Edge Jitter, Sambar Eligibility, Amma Approval, and more
- 🏆 **Global Leaderboard** - Hall of fame featuring the finest (fictional) circular dosas
- 🎮 **Easter Eggs** - Konami Code support (coming soon)
- ♿ **Accessible** - ARIA labels, keyboard navigation, reduced-motion support
- 🔒 **Secure** - No unsafe HTML injection, client-side only processing
- ⚡ **Built with Next.js** - Server-side rendering, optimized performance, modern React

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/NobinSijo7T/ds.git
cd ds/dosa-analyzer
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Export as Static Site

```bash
# Build and export as static HTML
npm run build

# The static files will be in the `out` directory
# Deploy the `out` folder to any static hosting service
```

## 🏗️ Project Structure

```
dosa-analyzer/
├── app/
│   ├── globals.css          # Global styles with custom animations
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main page component
├── components/
│   ├── Analyzer.tsx          # Main analyzer section
│   ├── DosaCSSArt.tsx        # CSS art dosa component
│   ├── Hero.tsx              # Hero section
│   ├── Navbar.tsx            # Navigation bar
│   ├── ParticleCanvas.tsx    # Particle background animation
│   ├── ResultsPanel.tsx      # Analysis results display
│   ├── Ticker.tsx            # News ticker
│   └── UploadPanel.tsx       # Image upload interface
├── lib/
│   ├── constants.ts          # App constants (samples, verdicts, etc.)
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
├── public/                   # Static assets
└── package.json
```

## 🎨 Technology Stack

- **[Next.js 16.3](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React 19](https://react.dev/)** - Latest React features
- **Canvas API** - Particle background animation
- **Custom Animations** - CSS keyframes for dosa effects

## 🧪 "The Science"

Our rigorous methodology includes:

- **Neural Dosa Networks (NDN)** - 847-layer deep neural network*
- **Hough Transform + Prayers** - Computer vision with statistical prayers*
- **Quantum Crispiness Detection** - Leveraging quantum superposition*
- **Fourier Series of Regret** - Mathematical quantification of disappointment*
- **LLM-Powered Shame Engine** - Contextual shame calibration*

**\*None of this is real. Scores are randomly generated for comedic effect.**

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Other Platforms

- **Netlify**: `npm run build` and deploy the `.next` folder
- **AWS Amplify**: Connect your repo and use build command `npm run build`
- **Cloudflare Pages**: Build command `npm run build`, output directory `.next`
- **Static Export**: Add `output: 'export'` to `next.config.ts` and deploy the `out` folder

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests for:

- Bug fixes
- New features (real circle detection with OpenCV.js?)
- Accessibility improvements
- Additional sample dosas
- Translation to other languages
- Additional sections (Leaderboard, Science, Testimonials)

### Development Guidelines

1. Use TypeScript for all new files
2. Follow the existing component structure
3. Add proper type definitions
4. Maintain accessibility (ARIA labels, keyboard navigation)
5. Test on multiple browsers and devices

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by all the perfectly imperfect dosas made around the world
- Special thanks to every Amma who has ever sighed at an elliptical dosa
- Dedicated to South Indian breakfast enthusiasts everywhere
- Built with ❤️ using Next.js and modern web technologies

## 📞 Contact

- GitHub: [@NobinSijo7T](https://github.com/NobinSijo7T)
- Original Repo: [https://github.com/NobinSijo7T/ds](https://github.com/NobinSijo7T/ds)
- Issues: [Report a bug](https://github.com/NobinSijo7T/ds/issues)

## 🔮 Roadmap

- [ ] Add remaining sections (Science, Leaderboard, Testimonials, About)
- [ ] Implement real OpenCV.js circle detection
- [ ] Add image crop/rotate functionality
- [ ] PWA support with offline capabilities
- [ ] Social sharing with Open Graph images
- [ ] Export results as PDF
- [ ] Webcam capture support
- [ ] i18n support (Tamil, Hindi, Kannada, Telugu)

## 🎭 Fun Facts

- The particle system uses actual Canvas API rendering
- All animations respect `prefers-reduced-motion`
- The dosa wobble animation uses CSS `border-radius` keyframes
- Scores are deterministic for sample dosas, random for uploads
- The "analysis" steps are purely theatrical

---

**Made with ❤️, Next.js, and a concerning amount of time spent on dosa-related humor.**

*"The universe itself is not perfectly circular. Neither is your dosa."*

## 🆚 Version Comparison

| Feature | Static Version | Next.js Version |
|---------|---------------|-----------------|
| Framework | Vanilla JS | Next.js 16 + React 19 |
| Type Safety | None | Full TypeScript |
| Styling | Pure CSS | Tailwind CSS |
| Components | N/A | Modular React components |
| SEO | Basic | Enhanced with metadata API |
| Performance | Good | Optimized with SSR/SSG |
| Development | Refresh browser | Hot Module Replacement |
| Scalability | Limited | Highly scalable |

## 🔧 Troubleshooting

### Port 3000 already in use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Build errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Regenerate type declarations
rm -rf .next
npm run dev
```

---

**Last Updated**: September 2026  
**Next.js Version**: 16.3.5  
**Bundle A**: ✅ Complete (Security, Accessibility, Documentation)  
**Bundle B**: ⏳ Planned (OpenCV.js, Image Editor, Webcam, PDF Export)  
**Bundle C**: ⏳ Planned (Authentication, Backend, Leaderboard)
