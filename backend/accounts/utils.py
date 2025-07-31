from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_welcome_email(user):
    """
    Send a welcome email to newly registered users.
    """
    try:
        logger.info(f"Starting to send welcome email to {user.email}")
        logger.info(f"Using email settings: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}")
        
        context = {
            'user': user,
            'site_url': settings.FRONTEND_URL if hasattr(settings, 'FRONTEND_URL') else 'https://tripffer-5kzq.vercel.app'
        }
        
        # Render HTML content
        html_content = render_to_string('email/welcome.html', context)
        text_content = strip_tags(html_content)  # Strip HTML for text version
        
        subject = f'Welcome to Tripffer, {user.first_name}!'
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = user.email
        
        logger.info(f"Sending email from {from_email} to {to_email}")
        
        # Create email message
        msg = EmailMultiAlternatives(
            subject,
            text_content,
            from_email,
            [to_email]
        )
        
        # Attach HTML content
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        logger.info("Welcome email sent successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
        logger.error(f"Email settings: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}")
        logger.error(f"From: {settings.DEFAULT_FROM_EMAIL}, To: {user.email}")
        return False 