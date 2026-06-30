# ============================================
# Lap AI — Frontend Dockerfile
# Multi-stage: Vite build -> nginx static serve
# ============================================

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first for layer caching —
# npm install only re-runs when dependencies actually change
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the production bundle
COPY . .
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:1.27-alpine AS production

# curl is needed for a reliable healthcheck — busybox's wget
# in this alpine image has shown unreliable behavior in testing
RUN apk add --no-cache curl

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage — the final image
# never contains Node, npm, or any source code, only static files
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config: SPA routing + API proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]