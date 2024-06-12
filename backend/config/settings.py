"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 4.2.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv()


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
import json
SECRET_KEY = json.load(open(BASE_DIR / "secrets.json"))["DJANGO_SECRET_KEY"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "3.34.22.183",
    "www.draftnews.shop",
    "draftnews.shop",
    "www.seta-16.com",
    "seta-16.com",
]


# Application definition

INSTALLED_APPS = [
    'daphne',
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django.contrib.sites',

    "rest_framework_simplejwt.token_blacklist",
    "rest_framework.authtoken",
    "rest_framework",
    
    "corsheaders",
    'django_seed',
    'storages',

    "acc.apps.AccountConfig",
    "post.apps.PostConfig",
    'message.apps.MessageConfig',

    'channels',
    'chat',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.kakao',

]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer', # 또는 Redis를 사용할 수 있습니다.
    },
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, 'templates')],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Seoul"

USE_I18N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "acc.User"

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = json.load(open(BASE_DIR / "secrets.json"))["EMAIL_HOST_USER"]
EMAIL_HOST_PASSWORD = json.load(open(BASE_DIR / "secrets.json"))["EMAIL_HOST_PASSWORD"]
EMAIL_USE_TLS = True  
DEFAULT_FROM_MAIL = EMAIL_HOST_USER

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://localhost",
    "http://3.34.22.183",
    "http://3.34.22.183:3000",
    "http://www.draftnews.shop",
    "http://www.draftnews.shop:3000",
    "http://www.seta-16.com",
    "http://www.seta-16.com:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    # "ACCESS_TOKEN_LIFETIME": timedelta(seconds=5),
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=50),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}
CORS_ALLOW_CREDENTIALS = True

DEFAULT_FILE_STORAGE ='storages.backends.s3boto3.S3Boto3Storage'

AWS_ACCESS_KEY_ID = json.load(open(BASE_DIR / "secrets.json"))["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = json.load(open(BASE_DIR / "secrets.json"))["AWS_SECRET_ACCESS_KEY"]
AWS_STORAGE_BUCKET_NAME = 'picturebucket9856'
AWS_QUERYSTRING_AUTH = False

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}

# Redis를 사용하기 위해 필요
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': 'redis://127.0.0.1:6379/1',
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }

APPEND_SLASH = False


SITE_ID = 2

REST_USE_JWT = True

ACCOUNT_USERNAME_REQUIRED = True 

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

#Google_ID
STATE = json.load(open(BASE_DIR / "secrets.json"))["STATE"]
GOOGLE_CLIENT_ID = json.load(open(BASE_DIR / "secrets.json"))["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = json.load(open(BASE_DIR / "secrets.json"))["GOOGLE_CLIENT_SECRET"]

#Github_ID
GITHUB_CLIENT_ID = json.load(open(BASE_DIR / "secrets.json"))["GITHUB_CLIENT_ID"]
GITHUB_CLIENT_SECRET = json.load(open(BASE_DIR / "secrets.json"))["GITHUB_CLIENT_SECRET"]

#Kakao_ID
KAKAO_REST_API_KEY = json.load(open(BASE_DIR / "secrets.json"))["KAKAO_REST_API_KEY"]
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
ACCOUNT_LOGOUT_ON_GET = True

FRONT_BASE_URL = os.getenv('FRONT_BASE_URL')
BACK_BASE_URL = os.getenv('BACK_BASE_URL')

print(f'front url: {FRONT_BASE_URL}')
print(f'back url: {BACK_BASE_URL}')
