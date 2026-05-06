FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm ci --no-audit --progress=false

COPY . .

RUN npm run build -- --configuration production


FROM nginx:1.27-alpine

COPY --from=builder /app/dist/aletheia-front-end /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80