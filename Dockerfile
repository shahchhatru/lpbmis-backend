FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose port 3000
EXPOSE 8085

# Command to run the app
CMD ["npm", "start"]
