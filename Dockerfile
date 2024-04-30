FROM node:lts
RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /app

ENV PORT 80

COPY ["package.json", "package-lock.json", "./"]
COPY .env ./.env
COPY prisma ./prisma/

RUN npm install --production --silent && mv node_modules ../

RUN npm i -g prisma

COPY . .

RUN npx prisma generate --schema ./prisma/schema.prisma
RUN npx next build

EXPOSE 80

CMD ["npx", "next", "start"]