# Используем официальный легковесный веб-сервер
FROM nginx:alpine

# Копируем наши файлы в папку, которую nginx использует по умолчанию
COPY . /usr/share/nginx/html/

# Убедимся, что index.html существует и доступен
RUN chmod -R 644 /usr/share/nginx/html/*

# Экспонируем порт 80
EXPOSE 80

# Nginx автоматически запускается при старте контейнера
CMD ["nginx", "-g", "daemon off;"]