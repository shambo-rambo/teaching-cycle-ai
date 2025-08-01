# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
# Using --omit=dev to not install devDependencies in production
RUN npm install --omit=dev

# Bundle app source
COPY . .

# Your app binds to port 3001, so expose it
EXPOSE 3001

# Define the command to run your app
CMD [ "node", "src/app.js" ]
