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

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
