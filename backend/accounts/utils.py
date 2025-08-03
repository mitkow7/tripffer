from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_welcome_email(user):
    """
    Send a welcome email to newly registered users.
    """
    context = {
        'user': user,
        'site_url': 'http://localhost:5173'  # Change this in production
    }
    
    # Render HTML content
    html_content = render_to_string('email/welcome.html', context)
    text_content = strip_tags(html_content)  # Strip HTML for text version
    
    subject = f'Welcome to Tripffer, {user.first_name}!'
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = user.email
    
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
    try:
        msg.send()
        return True
    except Exception as e:
        print(f"Failed to send welcome email: {str(e)}")
        return False 