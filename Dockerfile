FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install 

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["sh", "-c", "pnpm dev"]