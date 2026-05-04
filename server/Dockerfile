FROM node:18-alpine

# Install curl (for healthchecks)
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies (faster & reliable)
RUN npm ci --omit=dev

# Copy rest of the code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Use non-root user (security best practice)
USER node

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "src/server.js"]