# ===== Build stage =====
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copy package.json + package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# ==== Env React cho build ====
# Chỉ đọc được lúc build
ARG REACT_APP_API_URL
ARG REACT_APP_SOCKET_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

# Build React
RUN npm run build

# ===== Production stage =====
FROM nginx:alpine

# Copy build React sang nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy config nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]
