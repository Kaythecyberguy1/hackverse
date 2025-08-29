FROM node:20

WORKDIR /app

# Install deps
COPY hackverse-backend/package*.json ./hackverse-backend/
WORKDIR /app/hackverse-backend
RUN npm install

# Copy backend code
COPY hackverse-backend .

EXPOSE 8080
CMD ["npm", "run", "dev"]
