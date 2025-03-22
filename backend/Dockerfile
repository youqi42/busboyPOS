FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env.example ./.env.example

RUN npm install --production

EXPOSE 5000

CMD ["node", "dist/server.js"] 