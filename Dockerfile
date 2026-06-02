# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies (cached unless lockfile/manifest changes)
COPY package*.json ./
RUN npm ci

# Build the static site
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
