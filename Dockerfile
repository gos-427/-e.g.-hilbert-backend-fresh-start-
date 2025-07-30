# Use official Node.js base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions (package.json and package-lock.json)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application code into the container
COPY . .

# Expose the port your app will listen on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
