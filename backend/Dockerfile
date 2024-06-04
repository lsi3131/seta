# 베이스 이미지 설정
FROM python:3.10-slim

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

# 프로젝트 파일 복사
COPY . /app/

# 포트 설정 (Django 기본 포트는 8000)
EXPOSE 8000

# Django 애플리케이션 시작 명령
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
#CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]