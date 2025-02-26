FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "docs:dev"]