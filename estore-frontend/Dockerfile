# Frontend Dockerfile
FROM node:20-bullseye

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build for production
RUN npm run build

EXPOSE 5173

# Serve built assets
# Using Vite preview keeps SPA routing working via fallback.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

