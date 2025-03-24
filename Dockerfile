FROM node:20-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "docs:dev"]

# How to run it?
# docker build -t ntvu19/git-vuepress:v1 .
# docker run -it --rm -v ${PWD}:/app -p 8080:8080 ntvu19/git-vuepress:v1 /bin/sh
# npm run docs:dev
