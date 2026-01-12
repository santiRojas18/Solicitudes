## Solicitudes API

### Ejecutar
- Java 17
- Spring Boot
- H2 en memoria

### Endpoints

POST /api/solicitudes  
Crea una solicitud

GET /api/solicitudes  
Lista solicitudes

PUT /api/solicitudes/{id}/estado?estado=APROBADO  
Cambia estado

GET /api/solicitudes/{id}/historial  
Historial de cambios