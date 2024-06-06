#!/bin/bash

docker-compose build

#생성되는 none 태그 파일 삭제
docker rmi $(docker images -f "dangling=true" -q)

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend"
docker tag lsi3131/seta_frontend:latest 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend:latest
docker push 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend:latest

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend"
docker tag lsi3131/seta_backend:latest 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend:latest
docker push 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend:latest
