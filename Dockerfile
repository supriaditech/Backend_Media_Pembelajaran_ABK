# ---- Tahap 1: Build ----
    FROM node:22-slim AS builder

    # Set environment variable untuk kompatibilitas OpenSSL 3.0
    ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
    
    # Set direktori kerja di dalam container
    WORKDIR /usr/src/app
    
    # Salin package.json dan lock files
    COPY package*.json ./
    COPY yarn.lock ./
    
    # Install dependencies termasuk devDependencies (diperlukan untuk build)
    RUN yarn install --frozen-lockfile
    
    # Salin schema Prisma dan generate client
    COPY ./prisma ./prisma/
    RUN npx prisma generate
    
    # Salin semua source code
    COPY . .
    
    # Build aplikasi NestJS untuk production
    RUN yarn build
    
    # ---- Tahap 2: Produksi ----
    FROM node:22-slim
    
    # Set environment variable untuk runtime kompatibilitas OpenSSL 3.0
    ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
    ENV NODE_ENV=production
    
    WORKDIR /usr/src/app
    
    # Salin hanya yang diperlukan untuk production
    COPY --from=builder /usr/src/app/node_modules ./node_modules
    COPY --from=builder /usr/src/app/dist ./dist
    COPY --from=builder /usr/src/app/package.json ./
    
    # Jika menggunakan Prisma migrations di runtime, salin juga:
    COPY --from=builder /usr/src/app/prisma ./prisma
    
    # Perintah untuk menjalankan aplikasi NestJS
    CMD ["node", "dist/src/main"]