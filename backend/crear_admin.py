import os
import django

# Configuramos el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings') # Cambia 'config' por el nombre de tu carpeta
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin'
email = 'admin@ejemplo.com'
password = 'admin'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superusuario '{username}' creado con éxito.")
else:
    print(f"El usuario '{username}' ya existe.")