# Use the official Node.js image as a base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app source code into the working directory
COPY . .

# Install Chromium and its dependencies
RUN apt-get update && apt-get install -y chromium-browser

# Expose the port your app will run on
EXPOSE 8080

# Start the app
CMD ["npm", "start"]