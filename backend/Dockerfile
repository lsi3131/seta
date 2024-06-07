# 베이스 이미지 설정
FROM python:3.10-slim AS builder

# 환경 변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update \
    && apt-get install -y build-essential libpq-dev curl

# Python 패키지 설치를 위한 설정 파일 복사
COPY requirements.txt /app/

# Python 패키지 설치
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 최종 이미지 설정
FROM python:3.10-slim

# 환경 변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update \
    && apt-get install -y libpq-dev curl

# builder 이미지에서 설치한 Python 패키지 복사
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 프로젝트 파일 복사
COPY . /app/

# 프로젝트 파일 복사
COPY --from=builder /app /app

# 포트 설정 (Django 기본 포트는 8000)
EXPOSE 8000

# docker-compose, docker run을 동시에 사용하기 위해
CMD ["sh", "-c", "if [ -f /app/backend/manage.py ]; then python backend/manage.py runserver 0.0.0.0:8000; else python manage.py runserver 0.0.0.0:8000; fi"]