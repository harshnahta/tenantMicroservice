This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

docker run -p 3000:3003 frontend-service

# Need to run this first

docker network create app-network

docker network connect app-network auth-service

docker network connect app-network product-service

docker-compose up --build

docker-compose up --build -d
