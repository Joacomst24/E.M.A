# Manual de Usuario — E.M.A
## Enlace Médico Asistido

**Versión del sistema**: 1.0  
**Destinatarios**: Personal de salud y pacientes del hospital  

---

## Índice

1. [Introducción](#introducción)
2. [Acceso al sistema](#acceso-al-sistema)
3. [Guía para el personal de salud](#guía-para-el-personal-de-salud)
   - [Panel de Recepción / Enfermería](#panel-de-recepción--enfermería)
   - [Activar un modo de comunicación](#activar-un-modo-de-comunicación)
   - [Restablecer la pantalla del paciente](#restablecer-la-pantalla-del-paciente)
   - [Panel de administración de mensajes](#panel-de-administración-de-mensajes)
4. [Guía para el paciente](#guía-para-el-paciente)
   - [Pantalla de espera](#pantalla-de-espera)
   - [Modo Audio Asistido](#modo-audio-asistido)
   - [Modo Texto Visual](#modo-texto-visual)
   - [Modo Guiado por Frases](#modo-guiado-por-frases)
5. [Preguntas frecuentes](#preguntas-frecuentes)
6. [Solución de problemas](#solución-de-problemas)

---

## Introducción

**E.M.A (Enlace Médico Asistido)** es un sistema digital diseñado para mejorar la comunicación entre el personal del hospital y los pacientes que tienen dificultades para comunicarse de forma habitual. Esto incluye personas con:

- **Baja o nula visión** → usa el Modo Audio Asistido
- **Hipoacusia o sordera** → usa el Modo Texto Visual
- **Mudez, afonía o dificultad para hablar** → usa el Modo Guiado por Frases

El sistema funciona con **dos pantallas**:
- Una **pantalla de recepción/enfermería** (controlada por el personal).
- Una **pantalla táctil** ubicada donde el paciente pueda verla e interactuar (sala de espera, admisión, etc.).

---

## Acceso al Sistema

> **Nota — Versión de prueba**: En la versión actual del sistema, al abrir la aplicación aparece una pantalla de selección de dispositivo que permite elegir entre "Recepción" y "Pantalla táctil". Esta pantalla es **exclusiva de la etapa de prueba** y no formará parte del sistema en producción.
>
> En la implementación definitiva, **cada dispositivo tendrá su rol preconfigurado**: el equipo del personal de salud abrirá directamente el panel de recepción, y la pantalla del paciente iniciará directamente en modo de espera. Ninguno de los dos tendrá que seleccionar ni cambiar de rol.

Por el momento, al poner en marcha el sistema por primera vez en cada sesión de prueba, se debe indicar manualmente el rol correspondiente en cada dispositivo:

| Opción | Para quién |
|--------|-----------|
| **Recepción** | El personal de salud. Abre el panel de control. |
| **Pantalla táctil** | El dispositivo orientado al paciente. Queda en espera. |

---

## Guía para el Personal de Salud

### Panel de Recepción / Enfermería

Al seleccionar **"Recepción"**, se abre el panel operativo de E.M.A. Desde aquí el personal puede:

- Ver el **estado actual de la pantalla del paciente**.
- **Activar el modo de comunicación** apropiado para el paciente que está siendo atendido.
- Acceder al **panel de administración** para gestionar mensajes personalizados.

---

### Activar un Modo de Comunicación

El panel muestra tres modos. Seleccione el que corresponda al paciente:

#### Audio Asistido
**Icono**: altavoz  
**Para**: Pacientes con baja o nula visión.  
**Qué hace**: Activa una interfaz con un botón de micrófono grande. El paciente puede hablar y el sistema le responderá en voz alta con orientación sobre su consulta.

#### Texto Visual
**Icono**: oído tachado  
**Para**: Pacientes con hipoacusia o sordera.  
**Qué hace**: Muestra botones grandes con texto claro. El paciente toca la opción que necesita y recibe la respuesta en pantalla.

#### Guiado por Frases
**Icono**: globo de diálogo  
**Para**: Pacientes que no pueden hablar (mudez, afonía, dificultad verbal).  
**Qué hace**: El paciente selecciona frases prediseñadas o escribe un texto, y el sistema las lee en voz alta para que el personal presente pueda escuchar.

> El estado actualizado ("Modo activo: Audio / Texto / Guiado") aparecerá en el recuadro de estado del panel de recepción en tiempo real.

---

### Restablecer la Pantalla del Paciente

Si el paciente terminó su atención o se necesita iniciar una nueva atención, presione el botón:

**"Volver a pantalla de espera"**

Esto regresa la pantalla del paciente a la pantalla de bienvenida, lista para una nueva selección.

---

### Panel de Administración de Mensajes

Acceda desde el panel de recepción con el botón **"Administrar mensajes"**.

Desde aquí puede crear mensajes que aparecerán como botones adicionales en la pantalla del paciente, en el modo de accesibilidad correspondiente.

#### Cómo crear un mensaje

Rellene el formulario con los siguientes campos:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Título** | Nombre corto del botón que verá el paciente | `Horario de laboratorio` |
| **Contenido** | El texto o información completa del mensaje | `El laboratorio atiende de 7:00 a 12:00 hs.` |
| **Tipo de accesibilidad** | El modo donde aparecerá el mensaje | `Audio / Texto / Guiado` |
| **Apartado** | Grupo o sección donde se organiza el botón | `Admisión`, `Farmacia`, `Turnos` |
| **Icono personalizado** | Emoji o símbolo visual para identificar el botón | `🧪`, `💊`, `📅` |
| **Palabras clave** | Términos que activan este mensaje por reconocimiento de voz (solo Modo Audio) | `laboratorio, análisis, muestra` |

Luego presione **"Guardar mensaje"**. El mensaje aparecerá de forma inmediata en la pantalla del paciente dentro del modo seleccionado.

#### Cómo eliminar un mensaje

Los mensajes guardados aparecen listados en la parte inferior del panel de administración. Cada uno tiene un botón de eliminación.

> Los mensajes se guardan localmente en el navegador. No se perderán al recargar la página, pero sí si se borra el caché o los datos del navegador.

---

## Guía para el Paciente

### Pantalla de Espera

Al iniciar, la pantalla muestra el logotipo de E.M.A y el mensaje:

> *"Hola, soy E.M.A, tu asistente digital. Estoy listo para adaptar esta pantalla a la forma de comunicación que necesites. En unos segundos el personal del hospital seleccionará el modo adecuado para ti."*

**No es necesario hacer nada.** El personal de recepción o enfermería activará el modo correcto para usted.

---

### Modo Audio Asistido

Este modo es para personas con baja o nula visión.

**Cómo usarlo:**

1. Cuando la pantalla muestre el botón de micrófono, puede:
   - **Tocar el botón** con forma de micrófono ubicado en el centro de la pantalla.
   - **Tocar cualquier parte de la pantalla** para activar la escucha.

2. E.M.A le dirá: *"Escuchando..."* — en ese momento, **hable con claridad**.

3. Puede decir, por ejemplo:
   - *"Quiero registrarme"* → El sistema lo orientará al proceso de admisión.
   - *"Necesito información sobre mi turno"* → Recibirá indicaciones sobre turnos y consultorios.
   - *"Necesito ayuda"* o *"Me duele mucho"* → Se solicitará asistencia inmediata del personal.
   - *"Tengo dolor en el pecho"* o *"Me duele el estómago"* → El sistema detectará la especialidad médica y lo orientará al consultorio correcto.

4. E.M.A responderá en voz alta con la orientación correspondiente.

> Si E.M.A no entendió lo que dijo, le pedirá que lo intente de nuevo. Hable con calma y claridad.

---

### Modo Texto Visual

Este modo es para personas con hipoacusia o sordera.

**Cómo usarlo:**

La pantalla mostrará botones grandes con texto claro. Toque el botón que corresponda a su necesidad:

| Botón | Qué hace |
|-------|----------|
| **Registro de paciente** | Muestra información sobre cómo registrarse en admisión. |
| **Turnos y consultorios** | Muestra información sobre turnos y dónde dirigirse. |
| **Indicaciones generales** | Muestra instrucciones generales del hospital. |
| **Solicitar asistencia** | Avisa al personal que un paciente necesita ayuda. |

Si el personal de recepción agregó mensajes adicionales, aparecerán debajo de los botones principales organizados por secciones.

Al tocar cualquier botón, el mensaje completo aparecerá en una ventana emergente en pantalla. Toque **"Cerrar"** para regresar.

---

### Modo Guiado por Frases

Este modo es para personas que no pueden hablar o tienen dificultad verbal.

**Cómo usarlo:**

1. La pantalla mostrará frases prediseñadas. Toque la frase que quiera comunicar:
   - *"Quiero registrarme en admisión"*
   - *"Necesito asistencia de enfermería"*
   - *"Tengo una consulta médica"*

2. Al tocar una frase, el sistema la **leerá en voz alta** para que el personal presente pueda escucharla.

3. Si ninguna frase describe su necesidad, puede usar la sección **"Texto para narrador"**:
   - Escriba su mensaje en el cuadro de texto.
   - Toque el botón **"Leer texto escrito"**.
   - El sistema leerá lo que escribió en voz alta.

Si el personal cargó frases personalizadas, aparecerán debajo organizadas por apartados.

---

## Preguntas Frecuentes

**¿El sistema necesita internet?**  
No. E.M.A funciona completamente en red local. Solo se requiere conexión a internet para la carga inicial de fuentes tipográficas e íconos (opcional).

**¿El sistema guarda información del paciente?**  
No. E.M.A no registra ni almacena ningún dato personal del paciente. Solo guarda los mensajes administrativos creados por el personal.

**¿Cuántos pacientes puede atender a la vez?**  
La versión actual está diseñada para una atención individual: un panel de recepción y una pantalla de paciente. No soporta múltiples pantallas simultáneas desde un mismo panel.

**¿Funciona en cualquier navegador?**  
> **Nota — Versión de prueba**: Actualmente E.M.A se ejecuta en el navegador de forma local como parte de la etapa de desarrollo y prueba. En su versión definitiva, el sistema será un **programa descargable e instalable** en los equipos del hospital, sin necesidad de abrir un navegador manualmente.

Durante la etapa de prueba, se recomienda usar **Google Chrome** ya que ofrece el mejor soporte para las funciones de reconocimiento y síntesis de voz (Web Speech API).

**¿Qué pasa si el micrófono no funciona?**  
Verifique que el navegador tenga permiso para acceder al micrófono. En Chrome, aparecerá un ícono de micrófono en la barra de direcciones donde puede otorgar el permiso.

---

## Solución de Problemas

| Problema | Posible causa | Solución |
|----------|--------------|----------|
| La pantalla del paciente no se actualiza | Las dos ventanas no están en la misma sesión del navegador | Asegúrese de tener ambas pestañas abiertas en el mismo navegador y máquina |
| El micrófono no responde | Permiso denegado en el navegador | Haga clic en el ícono de candado o micrófono en la barra del navegador y otorgue permiso |
| E.M.A no entiende lo que digo | Ruido ambiental o habla poco clara | Hable más despacio y con claridad, acercándose al micrófono |
| La voz de E.M.A no se escucha | Volumen bajo o sin altavoces | Suba el volumen del dispositivo o conecte altavoces externos |
| Los mensajes personalizados no aparecen | Se borró el caché del navegador | Vuelva a cargar los mensajes desde el panel de administración |
| La página no carga | El servidor XAMPP no está activo | Inicie el módulo Apache desde el Panel de Control de XAMPP |

> **Recordatorio**: El uso de XAMPP y el navegador aplica únicamente durante la etapa de prueba. En la versión final, E.M.A será un programa instalable que no requerirá estos pasos.
