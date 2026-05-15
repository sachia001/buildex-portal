FROM node:20-slim

WORKDIR /app

COPY . .

RUN npm install --production=false

RUN npm install --prefix client

RUN npm run build --prefix client

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
