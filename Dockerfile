# Step 1: Build stage
FROM node:22-alpine3.20 as builder

WORKDIR /app
COPY . .
# Cài đặt dependencies
#COPY package*.json ./

RUN npm ci

# Copy toàn bộ source code và build

RUN npm run build


# Step 2: Production stage
FROM node:22-alpine3.20

WORKDIR /app

# Chỉ copy những thứ cần thiết để chạy
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/firebase-admin-key.json ./firebase-admin-key.json
COPY --from=builder /app/.env ./.env
COPY package*.json ./

# Expose port (thường NestJS chạy port 3000)
EXPOSE 3000

# Command để start ứng dụng
CMD ["node", "dist/main"]