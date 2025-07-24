from django.db import migrations, models


def migrate_features_and_amenities(apps, schema_editor):
    Hotel = apps.get_model('hotels', 'Hotel')
    Feature = apps.get_model('hotels', 'Feature')
    
    # Create features from existing data
    for hotel in Hotel.objects.all():
        # Handle features
        if hotel.features:
            features = [f.strip() for f in hotel.features.split(',') if f.strip()]
            for feature_name in features:
                feature, _ = Feature.objects.get_or_create(
                    name=feature_name,
                    is_amenity=False
                )
                hotel.new_features.add(feature)
        
        # Handle amenities
        if hotel.amenities:
            amenities = [a.strip() for a in hotel.amenities.split(',') if a.strip()]
            for amenity_name in amenities:
                amenity, _ = Feature.objects.get_or_create(
                    name=amenity_name,
                    is_amenity=True
                )
                hotel.new_features.add(amenity)


class Migration(migrations.Migration):

    dependencies = [
        ('hotels', '0010_review'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('is_amenity', models.BooleanField(default=False, help_text="True if this is an amenity, False if it's a feature")),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.AddField(
            model_name='hotel',
            name='new_features',
            field=models.ManyToManyField(blank=True, related_name='hotels', to='hotels.feature'),
        ),
        migrations.RunPython(migrate_features_and_amenities),
        migrations.RemoveField(
            model_name='hotel',
            name='amenities',
        ),
        migrations.RemoveField(
            model_name='hotel',
            name='features',
        ),
        migrations.RenameField(
            model_name='hotel',
            old_name='new_features',
            new_name='features',
        ),
    ] 