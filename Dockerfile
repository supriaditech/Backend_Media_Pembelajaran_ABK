# ---- Tahap 1: Build ----
    FROM node:22-slim AS builder

    # Set environment variables untuk Prisma
    ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
    ENV OPENSSL_CONF=/dev/null
    
    # Install OpenSSL 3.0 dan dependencies penting
    RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /usr/src/app
    
    COPY package*.json ./
    COPY yarn.lock ./
    
    RUN yarn install --frozen-lockfile
    
    COPY ./prisma ./prisma/
    
    # Hapus cache Prisma lama dan generate baru
    RUN rm -rf node_modules/.prisma node_modules/.cache
    RUN npx prisma generate
    RUN npx prisma migrate deploy
    
    COPY . .
    
    RUN yarn build
    
    # ---- Tahap 2: Produksi ----
    FROM node:22-slim
    
    # Set environment variables untuk runtime
    ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
    ENV NODE_ENV=production
    ENV OPENSSL_CONF=/dev/null
    
    # Install runtime dependencies
    RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
    
    WORKDIR /usr/src/app
    
    COPY --from=builder /usr/src/app/node_modules ./node_modules
    COPY --from=builder /usr/src/app/dist ./dist
    COPY --from=builder /usr/src/app/package.json ./
    COPY --from=builder /usr/src/app/prisma ./prisma
    
    CMD ["node", "dist/src/main"]