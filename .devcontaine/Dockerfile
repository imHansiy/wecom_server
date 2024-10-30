# Use the official Node.js image as the base image
FROM node:18-bullseye

# Set working directory
WORKDIR /workspace

# Install dependencies (optional)
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Expose the application port
EXPOSE 3000

# Run the default command for Node.js container
CMD ["npm", "start"]
