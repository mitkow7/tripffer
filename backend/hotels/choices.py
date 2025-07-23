from django.db import models

class RoomType(models.TextChoices):
    SINGLE = 'SINGLE', 'Single'
    DOUBLE = 'DOUBLE', 'Double'
    TRIPLE = 'TRIPLE', 'Triple'
    QUAD = 'QUAD', 'Quad'
    KING = 'KING', 'King'
    SUITE = 'SUITE', 'Suite'
