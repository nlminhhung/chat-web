# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.7.1
FROM node:${NODE_VERSION}-alpine

# Set environment to development for running 'npm run dev'
ENV NODE_ENV development

WORKDIR /usr/src/app

# Download dependencies with proper caching
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Change ownership to the node user so that directories can be created
RUN chown -R node:node /usr/src/app

# Switch to the non-root user
USER node

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application in development mode.
CMD ["npm", "run", "dev"]
