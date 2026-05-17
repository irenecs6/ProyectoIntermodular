from rest_framework import serializers
from .models import Usuario, ONG, Ayuda, Donacion, Evidencia
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model= Usuario
        fields='__all__'
        
    def validate_dni(self, valor):
        if not valor:
            raise serializers.ValidationError("¡No puede estar vacio!")
        
        if len(valor) < 9:
            raise serializers.ValidationError("Debe tener 9 caracteres")
        return valor
    
    def create(self, validated_data):
        validated_data['clave'] = make_password(validated_data['clave'])
        return super().create(validated_data)
    

class ONGSerializer(serializers.ModelSerializer):
    class Meta:
        model= ONG
        fields='__all__'
        
    def validate_cif(self, valor):
        if not valor:
            raise serializers.ValidationError("¡No puede estar vacio!")
        
        if len(valor) < 9:
            raise serializers.ValidationError("Debe tener 9 caracteres")
        return valor
    
    def create(self, validated_data):
        validated_data['clave'] = make_password(validated_data['clave'])
        return super().create(validated_data)
    
class EvidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidencia
        fields = '__all__'
    
class AyudaSerializer(serializers.ModelSerializer):
    #para que en las ayudas pueda coger las evidencias y el nombre de la ong
    evidencia = EvidenciaSerializer(many=True, read_only=True)
    ong_nombre = serializers.ReadOnlyField(source='ong.nombrecompleto')
    ong_estado = serializers.ReadOnlyField(source='ong.estado')

    class Meta:
        model = Ayuda
        fields = [
            'id',
            'nombreayuda', 
            'descripcion', 
            'fechainicio', 
            'fechafin', 
            'objetivoFinaciero', 
            'estado',
            'montonrecaudado',
            'ong',
            'evidencia',
            'ong_nombre',
            'ong_estado'
        ]

    def update(self, instance, validated_data):
        #si el objetivo ya esta conseguido no se puede modificar
        if instance.montonrecaudado >= instance.objetivoFinaciero:
            raise serializers.ValidationError(
                {"error": "No puedes modificar una campaña ya completada."}
            )
        return super().update(instance, validated_data)
    
class DonacionSerializer(serializers.ModelSerializer):
    nombre_ayuda = serializers.CharField(source='ayuda.nombreayuda', read_only=True)
    nombre_ong = serializers.CharField(source='ayuda.ong.nombre', read_only=True)
    
    class Meta:
        model = Donacion
        fields = ['id', 
                  'ayuda', 
                  'dniusuario', 
                  'fecha', 
                  'metodopago',
                  'estado', 
                  'cantidad',
                  'nombre_ayuda', 
                  'nombre_ong']
    
    def validate(self, data):
        ayuda = data['ayuda']
        importe_donacion = data['cantidad']

        #calculamos el dinero que faltaria
        dinero_faltante = ayuda.objetivoFinaciero - ayuda.montonrecaudado

        #si intenta donar de mas se avisa
        if importe_donacion > dinero_faltante:
            raise serializers.ValidationError({
                "error": f"A esta ayuda solo le faltan {dinero_faltante}€ para llegar a su objetivo."
            })
        return data

