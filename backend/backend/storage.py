from decouple import config
from storages.backends.s3boto3 import S3Boto3Storage

# AWS S3 Configuration
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default=None)
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default=None)
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default=None)
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='eu-north-1').split('#')[0].strip()

# Basic S3 Settings
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None  # Don't use ACLs, rely on bucket policy
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
    default_acl = None  # Don't set ACL, rely on bucket policy for public access
    querystring_auth = False
    custom_domain = AWS_S3_CUSTOM_DOMAIN if AWS_S3_CUSTOM_DOMAIN else None
    
    def get_accessed_time(self, name):
        return None

    def get_created_time(self, name):
        return None

# Note: STORAGES configuration is now handled in settings.py for Django 4.2+ compatibility