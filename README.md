# 🌐 Indra API Documentation

## 📌 Overview
API para gestión de citas médicas desplegada en AWS API Gateway.

## 🔗 Base URL
https://sz17fug5x1.execute-api.us-east-1.amazonaws.com/dev


## 🚀 Endpoints

### 📚 Documentación
| Método | Endpoint | Descripción | Función Lambda |
|--------|----------|-------------|----------------|
| `GET` | `/docs` | Interfaz Swagger UI | `indra-api-dev-swaggerUI` |

### 📅 Citas (Appointments)
| Método | Endpoint | Descripción | Función Lambda |
|--------|----------|-------------|----------------|
| `GET` | `/appointment` | Listar todas las citas | `indra-api-dev-listAppo` |
| `GET` | `/appointment/{appoId}` | Obtener cita específica | `indra-api-dev-getAppoById` |
| `POST` | `/add` | Crear/Actualizar cita | `indra-api-dev-insertAndUpdate` |

### ⚕️ Endpoints Especializados
| Método | Endpoint | Descripción | Función Lambda |
|--------|----------|-------------|----------------|
| `GET` | `/citaPe` | Citas - Pacientes | `indra-api-dev-citaPe` |
| `GET` | `/citaCl` | Citas - Clínicas | `indra-api-dev-citaCl` |

## ⚙️ Detalles Técnicos
- **🔧 Stage:** `dev`
- **🌎 Region:** `us-east-1`
- **🧱 Stack:** `indra-api-dev`
- **📦 Tamaño funciones:** 29 MB cada una
- **⏱️ Tiempo despliegue:** 65 segundos

## 📝 Ejemplo de Uso
```bash
curl -X GET "https://sz17fug5x1.execute-api.us-east-1.amazonaws.com/dev/appointment"

// Ejemplo de respuesta esperada
{
  "data": [
    {
      "id": "123",
      "paciente": "Juan Pérez",
      "fecha": "2023-05-15"
    }
  ]
}

<sub>✨ Documentación generada automáticamente</sub>



### Características:
- ✅ Iconos visuales para mejor navegación
- ✅ Tablas organizadas
- ✅ Sintaxis markdown lista para GitHub/GitLab
- ✅ Ejemplo de request/response
- ✅ Detalles técnicos destacados
- ✅ Formato responsive
