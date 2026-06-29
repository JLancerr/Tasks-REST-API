# --- STAGE 1: Build the application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your application code
COPY . .

# Generate Prisma Client types (Crucial step for NestJS to compile!)
RUN npx prisma generate

# Compile TypeScript to production JavaScript
RUN npm run build

# --- STAGE 2: Production execution environment ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only the compiled code and production artifacts from the builder stage
COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose the API port
EXPOSE 3000

# Start the application using the production build
CMD ["node", "dist/main.js"]
