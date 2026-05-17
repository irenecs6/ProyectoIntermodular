from django.db import models

# Create your models here.  
class Usuario(models.Model):
    dni = models.CharField(max_length=15, primary_key=True, verbose_name="DNI") # PK
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    email = models.EmailField(unique=True) # UK
    clave = models.CharField(max_length=128)
    cartera = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    fechanacimiento = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellidos} ({self.dni})"


class ONG(models.Model):
    ESTADO_ONG = [
        ('V', 'Sin verificar'),
        ('F', 'Fiable'),
        ('S', 'Sospechosa'),
    ]

    cif = models.CharField(max_length=9, primary_key=True, verbose_name="CIF") # PK
    nombrecompleto = models.CharField(max_length=200)
    email = models.EmailField(unique=True) # UK
    clave = models.CharField(max_length=128)
    documentacionLegal = models.FileField(upload_to='documentos_ong/', blank=True, null=True)
    estado = models.CharField(max_length=1, choices=ESTADO_ONG, default='V')
    iban = models.CharField(max_length=34, unique=True) # UK
    descripcion = models.TextField(blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.nombrecompleto
    
class Ayuda(models.Model):
    ESTADOS_AYUDA = [
        ('A', 'Activa'),
        ('C', 'Objetivo conseguido'),
        ('X', 'Cancelado por la ONG'),
    ]
    nombreayuda = models.CharField(max_length=200)
    descripcion = models.TextField()
    fechainicio = models.DateField()
    fechafin = models.DateField()
    objetivoFinaciero = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    estado = models.CharField(max_length=1, choices=ESTADOS_AYUDA, default='A')
    montonrecaudado = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    ong = models.ForeignKey(ONG, on_delete=models.CASCADE, related_name='ayudas_publicadas')

    def __str__(self):
        return f"{self.nombreayuda} ({self.ong.nombrecompleto})"
    
    def save(self, *args, **kwargs):
        #si ya consiguio el objetivo cambiamo el estado
        if self.montonrecaudado >= self.objetivoFinaciero:
            self.estado = 'C'  
        super().save(*args, **kwargs)

class Donacion(models.Model):
    METODOS_PAGO = [
        ('T', 'Tarjeta'),
        ('P', 'PayPal'),
        ('X', 'Transferencia'),
    ]
    dniusuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, related_name='donante', null=True)
    ayuda = models.ForeignKey(Ayuda, on_delete=models.CASCADE, related_name='ayuda_donante')
    fecha = models.DateField()
    metodopago = models.CharField(max_length=1, choices=METODOS_PAGO, default='T')
    estado = models.CharField(max_length=15)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Donado {self.cantidad}€ para {self.ayuda.nombreayuda} ({self.ayuda.ong.nombrecompleto})"
                     

class Evidencia(models.Model):
    TIPO_EVID = [
        ('I', 'Imagen'),
        ('P', 'PDF'),
    ]
    ayuda = models.ForeignKey(Ayuda, on_delete=models.CASCADE, related_name='evidencia')
    tipo = models.CharField(max_length=1, choices=TIPO_EVID, default='P')
    descripcion = models.TextField()
    archivo = models.FileField(upload_to='evidencias/')
    montonjustificado = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    fechaGasto = models.DateField()

    def __str__(self):
        return f"Evidencia de {self.ayuda.nombreayuda} ({self.ayuda.ong.nombrecompleto}) - {self.fechaGasto}"