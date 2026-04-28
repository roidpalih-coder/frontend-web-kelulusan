FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

FROM svenstaro/miniserve:alpine AS runner

WORKDIR /public

COPY --from=builder /app/dist .

EXPOSE 80

CMD ["--port", "80", "--index", "index.html", "--spa"]
