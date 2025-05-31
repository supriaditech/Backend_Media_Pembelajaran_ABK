# ---- Tahap 1: Build ----
# Menggunakan Node.js versi 22 sesuai dengan lingkungan lokal Anda
FROM node:22-alpine AS builder

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

RUN npx prisma generate
# Salin semua sisa source code
COPY . .

# Build aplikasi untuk production
RUN yarn build

# ---- Tahap 2: Produksi ----
# Menggunakan base image yang sama untuk production
FROM node:22-alpine

WORKDIR /usr/src/app

# Salin dependencies dari tahap 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Salin hasil build dari tahap 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD ["node", "dist/main"]