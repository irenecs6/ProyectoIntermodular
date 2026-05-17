from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
import uuid # Herramienta de Python para fabricar tokens unicos
from django.db.models import Q
from .models import Usuario, ONG, Ayuda, Donacion, Evidencia
from .serializers import UsuarioSerializer, ONGSerializer, AyudaSerializer, DonacionSerializer, EvidenciaSerializer
from django.contrib.auth.hashers import check_password

#Registrar un Donante
class RegistroUsuario(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# Registrar una ONG
class RegistroONG(generics.CreateAPIView):
    queryset = ONG.objects.all()
    serializer_class = ONGSerializer

class AyudaViewSet(viewsets.ModelViewSet):
    queryset = Ayuda.objects.all()
    serializer_class = AyudaSerializer

class DonacionViewSet(viewsets.ModelViewSet):
    queryset = Donacion.objects.all()
    serializer_class = DonacionSerializer

    def perform_create(self, serializer):
        #creamo la donacion
        donacion = serializer.save()
        usuario = donacion.dniusuario
        #restamos la cantidad donada de la cartera
        usuario.cartera = float(usuario.cartera) - float(donacion.cantidad)
        #guardamo
        usuario.save()
        ayuda = donacion.ayuda
        #añadimo la cantidad donada
        ayuda.montonrecaudado += donacion.cantidad
        ayuda.save()

        print(f"Dinero restado a. Nuevo saldo: {usuario.cartera}")
        

class EvidenciaViewSet(viewsets.ModelViewSet):
    queryset = Evidencia.objects.all()
    serializer_class = EvidenciaSerializer

#Inicio Sesion
class Login(APIView):
    def post(self, request):
        #Cogemos el ident(DNI, CIF o email) y la pass
        identificador = request.data.get('username')
        password = request.data.get('password')

        #Comprobamos si es donante(usuario) por su DNI
        donante = Usuario.objects.filter(dni=identificador).first()
        #Si no es DNI, comprobamos por el email
        if not donante:
            donante = Usuario.objects.filter(email=identificador).first()
        #Lo encontramos
        if donante:
            #Comprobamos que la contraseña sean iguales
            if check_password(password, donante.clave):
                #Creamo un Token unico para el inicio de sesion
                token_falso = str(uuid.uuid4()) 
                return Response({'token': token_falso, 'rol': 'donante', 'id': donante.dni, 'cartera':donante.cartera,'mensaje': 'Inicio de sesión exitoso'})
            else:
                return Response({'error': 'Contraseña incorrecta'}, status=401)

        #Comprobamos si es ong por su CIF
        ong = ONG.objects.filter(cif=identificador).first()
        #Si no es un CIF, miramos si es email
        if not ong:
            ong = ONG.objects.filter(email=identificador).first()
        #Lo encontramos
        if ong:
            #Comprobamos que las contraseña sean iguales
            if check_password(password, ong.clave):
                token_falso = str(uuid.uuid4())
                return Response({'token': token_falso, 'rol': 'ong', 'id': ong.cif, 'mensaje': 'Inicio de sesión exitoso'})
            else:
                return Response({'error': 'Contraseña incorrecta'}, status=401)

        #Si no se encuentra
        print("No se ha encontrado ni DNI, ni CIF, ni Email")
        return Response({'error': 'El usuario o ONG no existe'}, status=400)
    
class PerfilDetalle(APIView):
    def get(self, request, identificador):
        #si es un donante
        usuario = Usuario.objects.filter(dni=identificador).first()
        if usuario:
            serializer = UsuarioSerializer(usuario)
            #Devolvemos los datos y el rol
            data = serializer.data
            data['rol'] = 'donante'
            return Response(data)

        #si es una ONG
        ong = ONG.objects.filter(cif=identificador).first()
        if ong:
            serializer = ONGSerializer(ong)
            data = serializer.data
            data['rol'] = 'ong'
            return Response(data)

        #si no lo encuentra
        return Response({'error': 'Perfil no encontrado'}, status=404)
    
    #Para actualizar los daatos
    def patch(self, request, identificador):
        #si es usuario
        usuario = Usuario.objects.filter(dni=identificador).first()
        if usuario:
            #actualizamos los campos que nos envie
            serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

        #si es ong
        ong = ONG.objects.filter(cif=identificador).first()
        if ong:
            serializer = ONGSerializer(ong, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

        return Response({'error': 'Perfil no encontrado'}, status=404)