# Dosametry - Production Dockerfile for Railway
# Optimized for Next.js 16.3.5 with standalone output
# IMPORTANT: Uses Node.js 20.18.1 (Required for Next.js 16)
# Build date: 2026-09-12

# Stage 1: Dependencies
FROM node:20.18.1-alpine AS deps
RUN apk add --no-cache libc6-compat

# Verify Node version
RUN node --version && echo "Node version verified: $(node --version)"

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Stage 2: Builder  
FROM node:20.18.1-alpine AS builder
WORKDIR /app

# Verify Node version in builder stage
RUN node --version && echo "Builder using Node: $(node --version)"

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js app with standalone output
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20.18.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure WASM files have correct permissions
RUN chmod -R 755 ./public/onnx

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
