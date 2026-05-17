FROM node:20-slim

WORKDIR /app

# Server deps
COPY package*.json ./
RUN npm install --production=false

# Client deps
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all source
COPY . .

# Build React client fresh from source
RUN cd client && npm run build

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
