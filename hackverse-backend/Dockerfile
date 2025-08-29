FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the backend code
COPY . .

# Expose backend port
EXPOSE 8080

# Start backend
CMD ["npm", "start"]
