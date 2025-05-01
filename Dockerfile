# 1. Используем официальный Node.js образ
FROM node:20

# 2. Создаём директорию для приложения
WORKDIR /app

# 3. Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm install

# 4. Копируем остальной код
COPY . .

# 5. Генерируем Prisma клиент
RUN npx prisma generate

# 6. Собираем Astro проект
RUN npm run build

# 7. Указываем порт (если SSR)
EXPOSE 3000

# 8. Запускаем сервер
CMD ["npm", "run", "preview"]
