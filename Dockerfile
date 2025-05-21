FROM node:latest-slim

# Create the application directory
WORKDIR /zenn-articles

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./


# Copy the rest of the application code
COPY . .

# Cache application dependencies
RUN pnpm install && \
    pnpm build

# Run the application
CMD ["run", "./build/mod.ts"]