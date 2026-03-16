FROM node:20-alpine

WORKDIR /app

# Install root dependencies
COPY package*.json ./
RUN npm install

# Build React client
COPY client/package*.json ./client/
RUN cd client && npm install

COPY . .
RUN cd client && npm run build

EXPOSE 3000

CMD ["node", "server.js"]
