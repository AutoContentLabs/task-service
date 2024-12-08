# Default images
ARG BASE_IMAGE="mcr.microsoft.com/devcontainers/javascript-node:22"

# Base stage
FROM $BASE_IMAGE AS base

# Set the working directory
WORKDIR /workspaces/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies (npm ci is more reliable and faster)
RUN npm ci

# Copy application files
COPY . .
