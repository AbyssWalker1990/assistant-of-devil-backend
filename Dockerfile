FROM node:18-alpine AS base
WORKDIR /app

# --- Production ---
FROM base AS prod
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/src/server.js"]

# --- Development ---
FROM base AS dev
EXPOSE 3000
CMD ["sh", "-c", "npm install && npm run dev"]
