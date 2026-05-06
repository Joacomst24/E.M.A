# E.M.A — Enlace Médico Asistido

Sistema de comunicación asistida para entornos hospitalarios, diseñado para facilitar la interacción entre el personal de salud y pacientes con capacidades comunicativas limitadas (baja o nula visión, hipoacusia, mudez o dificultad en el habla).

---

## Tabla de Contenidos

1. [Descripción del sistema](#descripción-del-sistema)
2. [Usuarios del sistema](#usuarios-del-sistema)
3. [Funcionalidades principales](#funcionalidades-principales)
4. [Requerimientos funcionales](#requerimientos-funcionales)
5. [Requerimientos no funcionales](#requerimientos-no-funcionales)
6. [Alcance del sistema](#alcance-del-sistema)
7. [Arquitectura técnica](#arquitectura-técnica)
8. [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
9. [Estructura de archivos](#estructura-de-archivos)
10. [Tecnologías utilizadas](#tecnologías-utilizadas)

---

## Descripción del Sistema

**E.M.A (Enlace Médico Asistido)** es una aplicación web de kiosco hospitalario que opera en dos dispositivos simultáneos: un **panel de control** para el personal de salud y una **pantalla táctil** orientada al paciente.

El personal selecciona el modo de comunicación apropiado para cada paciente, y la pantalla táctil se adapta en tiempo real a esa necesidad. La comunicación entre ambos dispositivos se realiza de forma local, sin requerir conexión a internet durante el uso.

---

## Usuarios del Sistema

| Rol | Descripción |
|-----|-------------|
| **Personal de salud** | Médicos, enfermeros y personal de admisión que operan el panel de recepción desde una PC o tablet interna. |
| **Paciente** | Persona atendida en el hospital que interactúa con la pantalla táctil en sala de espera o admisión. |

---

## Funcionalidades Principales

### Para el personal de salud

- **Selección de modo de comunicación**: El operador elige entre tres modos según las necesidades del paciente.
- **Panel de estado en tiempo real**: Visualiza qué modo está activo en la pantalla del paciente.
- **Administración de mensajes personalizados**: Crea, guarda y organiza mensajes por tipo de accesibilidad, apartado e icono, para que aparezcan como botones en la pantalla del paciente.
- **Restablecimiento remoto**: Puede devolver la pantalla del paciente a la pantalla de espera con un solo botón.

### Para el paciente

#### Modo Audio Asistido (para personas con baja o nula visión)
- Botón de micrófono central con activación táctil o por toque en cualquier zona de la pantalla.
- Reconocimiento de voz en español con síntesis de respuesta por voz femenina.
- Detección inteligente de intenciones: registro, información de turno, solicitud de ayuda.
- **Detección automática de especialidad médica**: el sistema analiza los síntomas descritos por el paciente y lo orienta verbalmente al consultorio correcto (14 especialidades disponibles).
- Lectura automática de mensajes personalizados cargados por el personal.

#### Modo Texto Visual (para personas con hipoacusia)
- Interfaz de botones grandes con textos claros.
- Opciones predefinidas: registro, turnos, indicaciones generales, solicitar asistencia.
- Mensajes personalizados visibles del personal de salud.
- Modal de respuesta con texto ampliado y legible.

#### Modo Guiado por Frases (para personas con dificultad en el habla)
- El paciente selecciona frases prediseñadas que el sistema lee en voz alta para comunicarse con el personal presente.
- Campo de texto libre para dictar mensajes personalizados al narrador de voz.
- Frases personalizadas cargadas por el personal, organizadas por apartados.

---

## Requerimientos Funcionales

| ID | Requerimiento |
|----|---------------|
| RF-01 | El sistema debe permitir al personal seleccionar el dispositivo como "Recepción" o "Pantalla táctil". |
| RF-02 | El panel de recepción debe mostrar tres modos de comunicación seleccionables. |
| RF-03 | Al activar un modo, la pantalla táctil debe actualizarse de forma inmediata y automática. |
| RF-04 | El modo Audio debe activar el reconocimiento de voz al tocar el botón o la pantalla. |
| RF-05 | El sistema de voz debe identificar la intención del paciente (registro, información, ayuda) mediante frases y palabras clave. |
| RF-06 | El sistema debe detectar la especialidad médica correspondiente según los síntomas descritos verbalmente. |
| RF-07 | El modo Texto debe presentar opciones con texto grande y claro, navegables táctilmente. |
| RF-08 | El modo Guiado debe leer en voz alta las frases seleccionadas o el texto ingresado manualmente. |
| RF-09 | El panel de administración debe permitir crear mensajes con título, contenido, tipo de accesibilidad, apartado e icono. |
| RF-10 | Los mensajes del panel de administración deben persistir entre sesiones y aparecer en la pantalla del paciente. |
| RF-11 | El personal debe poder restablecer la pantalla del paciente a la pantalla de espera en cualquier momento. |
| RF-12 | La pantalla de espera debe mostrar un mensaje de bienvenida e indicar al paciente que aguarde la selección del personal. |

---

## Requerimientos No Funcionales

| ID | Requerimiento |
|----|---------------|
| RNF-01 | La interfaz debe ser completamente táctil y accesible sin uso de teclado o mouse por parte del paciente. |
| RNF-02 | El tamaño del texto, botones e íconos deben ser adecuados para personas con visión reducida. |
| RNF-03 | La sincronización entre dispositivos debe ocurrir en menos de 1 segundo. |
| RNF-04 | El sistema debe funcionar en red local sin requerir conexión a internet. |
| RNF-05 | La voz sintetizada debe ser en español, preferentemente femenina, y de dicción clara. |
| RNF-06 | El sistema debe ser compatible con los navegadores modernos (Chrome recomendado para Web Speech API). |
| RNF-07 | Los datos de mensajes administrativos deben persistir localmente sin pérdida ante recargas. |

---

## Alcance del Sistema

### Qué incluye
- Interfaz de control para el personal de admisión/enfermería.
- Tres modos de comunicación adaptados a distintas discapacidades.
- Sistema de reconocimiento y síntesis de voz en español.
- Base de conocimiento médico con 14 especialidades para orientación por síntomas.
- Panel de administración de mensajes personalizados con persistencia local.
- Sincronización en tiempo real entre dos instancias del sistema en la misma red local.

### Qué NO incluye
- Gestión de historias clínicas o expedientes médicos.
- Asignación o reserva de turnos en línea.
- Integración con sistemas de gestión hospitalaria (HIS) externos.
- Autenticación o control de acceso por usuario/contraseña.
- Almacenamiento de datos en base de datos remota (la versión actual usa almacenamiento local del navegador).
- Soporte para múltiples pantallas de paciente simultáneas desde un mismo panel.
- Traducción a otros idiomas (el sistema opera únicamente en español).

---

## Arquitectura Técnica

### Modelo de comunicación entre dispositivos

El sistema opera con dos instancias del navegador abiertas en la misma red (o en la misma máquina en pestañas distintas):

```
[Dispositivo Recepción]           [Dispositivo Paciente]
  Panel operativo           →→→      Pantalla táctil
  Selecciona modo          sync      Se adapta al modo
  Gestiona mensajes       local      Muestra mensajes
```

La sincronización utiliza **`BroadcastChannel API`** para comunicación entre pestañas y **`localStorage`** como mecanismo de persistencia compartida del estado.

### Flujo del modo Audio

```
Paciente toca pantalla
        ↓
Web Speech API escucha
        ↓
Normalización del texto (minúsculas, sin tildes)
        ↓
  ┌─────────────────────────────┐
  │ 1. ¿Es una intención base?  │ → Registro / Información / Ayuda
  │ 2. ¿Es opción ciega?        │ → Botón predefinido del menú
  │ 3. ¿Es mensaje del personal?│ → Mensaje personalizado
  │ 4. ¿Describe síntomas?      │ → Orientación a especialidad médica
  │ 5. Fallback                 │ → Mensaje de asistencia genérico
  └─────────────────────────────┘
        ↓
Speech Synthesis API responde en voz alta
```

### Sistema de detección de especialidades

El algoritmo evalúa el texto del paciente con un modelo de puntuación:

- Coincidencia de síntoma exacto: **+3 puntos**
- Coincidencia de palabra clave: **+2 puntos**
- Umbral mínimo para asignar especialidad: **2 puntos**
- Se selecciona la especialidad con mayor puntaje total

---

## Instalación y Puesta en Marcha

### Requisitos previos
- [XAMPP](https://www.apachefriends.org/) instalado y funcionando (módulo Apache activo).
- Google Chrome u otro navegador compatible con Web Speech API.

### Pasos

1. Copiar la carpeta del proyecto en el directorio `htdocs` de XAMPP:
   ```
   C:\xampp\htdocs\E.M.A\
   ```

2. Iniciar el servidor Apache desde el Panel de Control de XAMPP.

3. Abrir dos ventanas o pestañas del navegador con la URL:
   ```
   http://localhost/E.M.A/
   ```

4. En la primera ventana, seleccionar **"Recepción"** — será el panel del personal.

5. En la segunda ventana, seleccionar **"Pantalla táctil"** — será la vista del paciente.

6. Desde Recepción, seleccionar el modo de comunicación del paciente. La segunda pantalla se actualizará automáticamente.

> **Nota sobre el micrófono**: El modo Audio requiere permiso de acceso al micrófono del navegador. Chrome puede solicitar este permiso la primera vez. Se recomienda usar `http://localhost` (no `file://`) para que las APIs de voz funcionen correctamente.

---

## Estructura de Archivos

```
E.M.A/
├── index.html          → Estructura completa de la aplicación (todas las pantallas)
├── styles.css          → Estilos visuales y adaptaciones de accesibilidad
├── script.js           → Lógica de la aplicación, reconocimiento de voz y sincronización
├── api/                → Carpeta reservada para futura integración con backend
├── MEDICAL_DATABASE.md → Documentación de la base de conocimiento médico
└── README.md           → Este archivo
```

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura de la interfaz y atributos de accesibilidad (ARIA) |
| CSS3 | Estilos, modos de alto contraste y diseño responsivo táctil |
| JavaScript (ES6+) | Lógica de negocio, reconocimiento de voz, sincronización |
| Web Speech API | Reconocimiento de voz (`SpeechRecognition`) y síntesis (`SpeechSynthesis`) |
| BroadcastChannel API | Comunicación en tiempo real entre pestañas del navegador |
| localStorage | Persistencia de mensajes y estado compartido |
| Font Awesome 6 | Iconografía de la interfaz |
| Google Fonts | Tipografías Nunito y Oswald |
| XAMPP / Apache | Servidor web local para servir la aplicación |
