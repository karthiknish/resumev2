# Install dependencies only when needed
FROM node:16-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ARG MONGODB_URI
ARG NOREPLY_EMAIL
ARG NOREPLY_PASS
ARG URL
ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG OPENAI_API_KEY
ARG GOOGLE_API_KEY
ARG CUSTOM_SEARCH_ENGINE_ID
ARG NEXTAUTH_URL
ARG JWT_SECRET
ARG PUPPETEER_EXECUTABLE_PATH
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run the app
FROM node:16-alpine AS runner

RUN apk add --no-cache chromium ca-certificates
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /app
ENV NODE_ENV=production


COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
