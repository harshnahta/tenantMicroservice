# Project Setup Guide

## Prerequisites

Before setting up the project, ensure the following dependencies are installed on your system:

- **Docker & Docker Compose** ([Install Guide](https://docs.docker.com/get-docker/))
- **Node.js & npm** ([Install Guide](https://nodejs.org/))
- **Redis** ([Install Guide](https://redis.io/docs/getting-started/))
- **PostgreSQL** ([Install Guide](https://www.postgresql.org/download/))

## Folder Structure

```sh
main-folder/
│── backend-auth-service/
│── backend-product-service/
│── frontend/
│── docker-compose.yml (Root file to manage all services)
│── start.sh (Script to run all services)
```

## Environment Setup

Each service requires a `.env` file. Ensure the necessary environment variables are set up correctly.

### **backend-auth-service**

Create `.env` inside `backend-auth-service`:

```sh
DATABASE_URL=postgres://user:password@db-host:5432/auth_db
REDIS_HOST=redis
REDIS_PORT=6379
```

### **backend-product-service**

Create `.env` inside `backend-product-service`:

```sh
DATABASE_URL=postgres://user:password@db-host:5432/product_db
REDIS_HOST=redis
REDIS_PORT=6379
```

### **frontend**

Create `.env` inside `frontend`:

```sh
API_ENDPOINT=http://auth-service:3002/v1/api
PRODUCT_API_ENDPOINT=http://product-service:3003/v1/api
HOST_URL=http://localhost:3000
```

## Setting Up the Project

### **Step 1: Install Dependencies**

Run the following commands inside each service directory:

```sh
cd backend-auth-service && npm install && cd ..
cd backend-product-service && npm install && cd ..
cd frontend && npm install && cd ..
```

### **Step 2: Run Database Migrations**

Run the following commands inside `backend-auth-service` and `backend-product-service`:

```sh
cd backend-auth-service && npm run prisma:migrate && npm run prisma:generate && cd ..
cd backend-product-service && npm run prisma:generate && cd ..
```

### **Step 3: Start Services Using Docker Compose**

Run the following commands from the root folder:

```sh
# Give execute permission to the script
chmod +x start.sh

# Run the script
./start.sh
```

Alternatively, you can run Docker Compose manually:

```sh
# Build and start services
docker-compose up --build

# If you want to run in the background
docker-compose up --build -d
```

## **Docker Network Configuration**

Before running the services, create a Docker network:

```sh
docker network create app-network
```

After starting the services, connect them to the network:

```sh
docker network connect app-network auth-service
docker network connect app-network product-service
```

## **Stopping Services**

To stop all running containers:

```sh
docker-compose down
```

To stop and remove all containers, networks, and volumes:

```sh
docker-compose down -v
```

## **Common Issues & Fixes**

1. **Port conflicts**

   - Ensure ports `3000`, `3002`, `3003`, and `6379` are not in use.
   - Change ports in `docker-compose.yml` if necessary.

2. **Database connection errors**

   - Ensure PostgreSQL is running and `DATABASE_URL` is correct.

3. **Docker network issues**
   - Run `docker network create app-network` before starting services.

---
