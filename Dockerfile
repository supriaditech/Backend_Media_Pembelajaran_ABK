# ---- Tahap 1: Build ----
    FROM node:22-slim AS builder

    # TAMBAHKAN BARIS INI untuk menginstall OpenSSL 1.1 di Debian
    RUN apt-get update && apt-get install -y --no-install-recommends libssl1.1 && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    COPY yarn.lock ./
    RUN yarn install
    
    COPY ./prisma ./prisma/
    RUN npx prisma generate
    
    COPY . .
    RUN yarn build
    
    # ---- Tahap 2: Produksi ----
    FROM node:22-slim
    
    # TAMBAHKAN BARIS INI JUGA DI SINI
    RUN apt-get update && apt-get install -y --no-install-recommends libssl1.1 && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /usr/src/app
    
    COPY --from=builder /usr/src/app/node_modules ./node_modules
    COPY --from=builder /usr/src/app/dist ./dist
    CMD ["node", "dist/src/main"]