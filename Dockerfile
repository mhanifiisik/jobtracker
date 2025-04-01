# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files (handle both npm and yarn)
COPY package*.json .
# Install dependencies based on available lock file
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]