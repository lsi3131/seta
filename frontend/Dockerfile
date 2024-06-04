# 빌드 단계
FROM node:14 AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json /app/
RUN npm install

COPY frontend ./
RUN npm run build

# 배포 단계
FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
