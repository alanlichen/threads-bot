FROM node:14-alpine
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

# pnpm work?
RUN npm i

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]