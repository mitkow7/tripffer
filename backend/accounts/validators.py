import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.core.validators import RegexValidator


class PhoneNumberValidator(RegexValidator):
    regex = r'^(\+?1?\s?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$|^(\+?\d{1,3}[\s\-]?)?\d{7,14}$'

    message = _(
        'Enter a valid phone number.(e.g., +1-234-567-8900 or 234-567-8900)'
    )

    code = 'invalid_phone_number'

    def __call__(self, value):
        if not value:
            return
        
        cleaned_value = self.clean_phone_number(value)

        digits_only = re.sub(r'\D', '', cleaned_value)
        if len(digits_only) < 7:
            raise ValidationError(
                _('Phone number must contain at least 7 digits.'),
                code='too_short',
            )
        elif len(digits_only) > 15:
            raise ValidationError(
                _('Phone number must not exceed 15 digits.'),
                code='too_long',
            )
        
        super().__call__(cleaned_value)

    def clean_phone_number(self, value):
        if not value:
            return value
        
        value = str(value).strip()

        value = re.sub(r'[\s\-\.\(\)]+', '-', value)
        value = re.sub(r'-+', '-', value)
        value = value.strip('-')

        return value