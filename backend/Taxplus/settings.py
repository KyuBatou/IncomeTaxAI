from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
import os


if os.getenv('ENV', 'local') == 'local': load_dotenv('.env')

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("DJANGO_SECRET")
DEBUG = os.environ.get("DJANGO_DEBUG", True)
EMAIL_DEBUG = os.environ.get("EMAIL_DEBUG")

if DEBUG:
    ALLOWED_HOSTS = ["*"]
    SECURE = False
else:
    SECURE = True
    ALLOWED_HOSTS = [
        "ai.incometaxlibrary.in",
        "ai.incometaxlibrary.com",
        "incometaxlibrary.in",
        "checkout.razorpay.com",
        'localhost:5173',
        "api.razorpay.com"
    ]


CORS_ALLOWED_ORIGINS = [

    'https://ai.incometaxlibrary.in',
    'https://ai.incometaxlibrary.com',
    'https://checkout.razorpay.com',
    'https://api.razorpay.com',
    'https://incometaxlibrary.in',
    "http://localhost:5173",
]

CORS_ALLOW_ALL_ORIGINS = True

CSRF_TRUSTED_ORIGINS = [
    "https://ai.incometaxlibrary.com",
    'https://incometaxlibrary.in',
    'https://checkout.razorpay.com',
    'https://api.razorpay.com',
]


ROOT_APPS = [
    # 'ai_backend',
    # 'home',
    # 'dt',
    # 'gst',
    # 'st',
    # 'cl',
    'login_auth',
    'core',
    # 'salesman',
]

INSTALLED_APPS = [
    'jet',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'whitenoise.runserver_nostatic',
    'corsheaders',
    'django_filters',
    'rest_framework',
    'djoser',
    'ckeditor',
    'user_visit',
    'ckeditor_uploader',

] + ROOT_APPS


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'user_visit.middleware.UserVisitMiddleware',

]

ROOT_URLCONF = 'Taxplus.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': [os.path.join(BASE_DIR, "templates")],
        'DIRS': [os.path.join(BASE_DIR, '../frontend/dist')],

        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Taxplus.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("DB_NAME"),
        'USER': os.environ.get("DB_USERNAME"),
        'PASSWORD': os.environ.get("DB_PASSWORD"),
        'HOST': os.environ.get("DB_HOST"),
        'PORT': os.environ.get("DB_PORT"),
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]

if os.environ.get("DJANGO_PROFILING"):
    INSTALLED_APPS += ["debug_toolbar"]
    MIDDLEWARE += [
        "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]

    def show_toolbar(request):
        return True

    DEBUG_TOOLBAR_PANELS = [
        "debug_toolbar.panels.sql.SQLPanel",
    ]

    DEBUG_TOOLBAR_CONFIG = {
        "SHOW_TOOLBAR_CALLBACK": show_toolbar,
    }

LANGUAGE_CODE = 'en-GB'
# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True
USE_L10N = True
PHONE_NUMBER_DB_FORMAT = "INTERNATIONAL"
USE_THOUSAND_SEPARATOR = False

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
# STATIC_URL = 'ai/static/'
# STATICFILES_DIRS = [
#     BASE_DIR / "static",
# ]
# STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# STATICFILES_STORAGE="whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_URL = 'assets/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE="whitenoise.storage.CompressedManifestStaticFilesStorage"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "../frontend/dist/assets"),
    os.path.join(BASE_DIR, "../frontend/dist/"),
]

CORS_ORIGIN_ALLOW_ALL = True
X_FRAME_OPTIONS = "ALLOWALL"

AUTH_USER_MODEL = 'login_auth.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'app.log'),
        },
    },
    'loggers': {
        '': {  # Root logger
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SERIALIZERS': {
        # 'user_create': 'ITL.serializer.CustomUserCreateSerializer',
    }
}

# JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=60),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

REST_FRAMEWORK = {
    'DATETIME_FORMAT': "%d-%m-%Y %H:%M:%S",
    'DATE_FORMAT': "%d-%m-%Y",
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'ITL.authentication.SessionAwareJWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

# CKEditor configuration
CKEDITOR_UPLOAD_PATH = "uploads/"
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full',
        'height': 500,
        'width': '100%',
        'extraPlugins': 'pastefromword',
        'allowedContent': True,
        'forcePasteAsPlainText': False,
    },
}


SESSION_COOKIE_AGE = 4 * 60 * 60
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = True
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
JET_INCLUDE_JQUERY = True

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.incometaxlibrary.com'
EMAIL_PORT = 587
EMAIL_USE_SSL = False
EMAIL_HOST_USER = 'support@incometaxlibrary.com'
EMAIL_HOST_PASSWORD = '%)ly8AAU%!Z2'
EMAIL_HOST_PASSWORD = 'Birloka@7498'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# handler404 = 'home.views.custom_500_view'
# handler500 = 'home.views.custom_500_view'
# handler403 = 'home.views.custom_500_view'

JET_THEMES = [
    {
        'theme': 'default',
        'color': '#47bac1',
        'title': 'Default'
    },
    {
        'theme': 'green',
        'color': '#44b78b',
        'title': 'Green'
    },
    {
        'theme': 'light-blue',
        'color': '#5EADDE',
        'title': 'Light Blue'
    },
]
JET_DEFAULT_THEME = 'light-blue'
JET_SIDE_MENU_COMPACT = True
JET_CHANGE_FORM_SIBLING_LINKS = True

PAYTM_MID = os.environ.get("PAYTM_MID")
PAYTM_MERCHANT_KEY = os.environ.get("PAYTM_MERCHANT_KEY")
PAYTM_WEBSITE = os.environ.get("PAYTM_WEBSITE")
PAYTM_CHANNEL_ID = os.environ.get("PAYTM_CHANNEL_ID")
PAYTM_INDUSTRY_TYPE_ID = os.environ.get("PAYTM_INDUSTRY_TYPE_ID")
PAYTM_ENVIRONMENT = os.environ.get("PAYTM_ENVIRONMENT")
PAYTM_PRODUCTION_URL = os.environ.get("PAYTM_PRODUCTION_URL")
DATA_UPLOAD_MAX_MEMORY_SIZE = 100 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 100 * 1024 * 1024
RAZORPAY_KEY_ID = 'rzp_test_pOCIYbOYzrYWUK'
RAZORPAY_KEY_SECRET = 'naQ0AQuSB0BimggKWZaeaymq'
PAYTM_INITIATE_URL = "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=YOUR_MID&orderId="
PAYTM_INITIATE_URL = "https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction"