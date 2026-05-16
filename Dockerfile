FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY client/package*.json ./client/
RUN cd client && npm install --production

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
