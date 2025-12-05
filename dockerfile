FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm install --legacy-peer-deps 
COPY . . 
RUN npm run build 
CMD ["sh", "-c", "echo 'React build completed'"]