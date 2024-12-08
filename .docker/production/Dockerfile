# Default images
ARG BASE_IMAGE="node:22-alpine"

# Base stage
FROM $BASE_IMAGE AS base

# Install curl, bash and sh (used to check if Verdaccio is running)
RUN apk add --no-cache curl bash

# If you are registered, you will remain at the root of the work environment.
WORKDIR /workspaces/app

# Copy package.json and package-lock.json files
COPY package*.json ./ 

# Check if Verdaccio is running, otherwise use npmjs registry
RUN if curl -s http://localhost:4873/ > /dev/null; then \
  echo "Verdaccio is running, using Verdaccio registry"; \
  npm set registry http://localhost:4873/; \
  else \
  echo "Verdaccio is not running, using npmjs registry"; \
  npm set registry https://registry.npmjs.org/; \
  fi

# Install dependencies using npm ci (more reliable and faster)
RUN npm ci --omit=dev

# Copy application files
COPY . .
