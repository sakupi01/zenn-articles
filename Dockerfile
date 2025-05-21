FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.11.0

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Copy source code and build files
COPY tsconfig.json ./
COPY src/ ./src/
COPY build/ ./build/

# Install dependencies and build the application
RUN pnpm install --frozen-lockfile && \
    pnpm run build

# Runtime image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm@10.11.0 && \
    pnpm install --prod --frozen-lockfile

# Copy built application from build stage
COPY --from=build /app/build ./build

# Create non-root user for security
RUN groupadd -r mcp && \
    useradd -r -g mcp mcp
USER mcp

# Command to run the server in stdio mode for MCP
CMD ["node", "--no-warnings", "./build/local.js"]