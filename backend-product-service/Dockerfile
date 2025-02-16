FROM node:18-bullseye
WORKDIR /app
# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install --legacy-peer-dep
COPY . .
RUN npm run prisma:generate
RUN npm run build
CMD ["npm", "run", "start:prod"]