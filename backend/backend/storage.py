from decouple import config
from storages.backends.s3boto3 import S3Boto3Storage

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default=None)
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default=None)
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default=None)
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='eu-north-1').split('#')[0].strip()

# Basic S3 Settings
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = 'public-read'  # Allow public read access to files
AWS_QUERYSTRING_AUTH = False  # Don't add query string auth
AWS_S3_USE_SSL = True
AWS_S3_VERIFY = True
AWS_S3_ADDRESSING_STYLE = 'virtual'  # Use virtual-hosted style URLs

# Performance Optimizations
AWS_IS_GZIPPED = True
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',  # 24 hours cache
}

# Generate custom domain for S3
if AWS_STORAGE_BUCKET_NAME and AWS_S3_REGION_NAME:
    AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com"
else:
    AWS_S3_CUSTOM_DOMAIN = None

# S3 Storage Class
class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'public-read'
    querystring_auth = False
    custom_domain = AWS_S3_CUSTOM_DOMAIN if AWS_S3_CUSTOM_DOMAIN else None
    
    def get_accessed_time(self, name):
        return None

    def get_created_time(self, name):
        return None

# Media files configuration
if all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME]):
    # Use S3 for media storage
    DEFAULT_FILE_STORAGE = 'backend.storage.MediaStorage'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
    
    # Log S3 configuration for debugging
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Using S3 for media storage: {AWS_S3_CUSTOM_DOMAIN}")
else:
    # Use local storage for media
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
    MEDIA_URL = '/media/'
    MEDIA_ROOT = 'media'
    
    # Log local storage configuration
    import logging
    logger = logging.getLogger(__name__)
    logger.warning("Using local storage for media files - S3 configuration incomplete")