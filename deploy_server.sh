aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend"
docker pull 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend:latest

aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin "767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend"
docker pull 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend:latest

docker rmi $(docker images -f "dangling=true" -q)

docker run -d --name seta-frontend -p 3000:3000 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-frontend:latest
docker run -d --name seta-backend -p 8000:8000 767398105786.dkr.ecr.ap-northeast-2.amazonaws.com/seta-backend:latest

