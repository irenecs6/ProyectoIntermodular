from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroUsuario, RegistroONG, Login, AyudaViewSet, DonacionViewSet, EvidenciaViewSet, PerfilDetalle

#Creamos el router para las ViewSets
router = DefaultRouter()
router.register(r'ayudas', AyudaViewSet, basename='ayuda')
router.register(r'donaciones', DonacionViewSet, basename='donacion')
router.register(r'evidencias', EvidenciaViewSet, basename='evidencia')


urlpatterns = [
    path('registro/usuario/', RegistroUsuario.as_view(), name='registro_usuario'),
    path('registro/ong/', RegistroONG.as_view(), name='registro_ong'),
    path('login/', Login.as_view(), name='login'),

    path('perfil/<str:identificador>/', PerfilDetalle.as_view(), name='perfil_detalle'),
    
    #Esta ruta incluye las viewsSets automaticas
    path('', include(router.urls)),
]