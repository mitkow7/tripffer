from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()

class CustomAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, email=None, password=None, **kwargs):
        try:
            # Try to get user by email first
            if email:
                user = UserModel.objects.get(email=email)
            # If no email provided, try username (which might be email)
            elif username:
                user = UserModel.objects.get(email=username)
            else:
                return None

            if user.check_password(password) and self.user_can_authenticate(user):
                return user
            return None
        except UserModel.DoesNotExist:
            return None
        except Exception as e:
            print(f"Authentication error: {str(e)}")  # Log the error
            raise  # Re-raise to let the view handle it 