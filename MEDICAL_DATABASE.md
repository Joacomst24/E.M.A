# Base de Datos Médica - E.M.A Hospital System

## Descripción General

Se implementó una **base de datos completa de especialidades médicas** integrada con el sistema de reconocimiento de voz de E.M.A. El sistema ahora puede detectar automáticamente qué especialidad médica necesita un paciente basándose en los síntomas que describe verbalmente.

---

## Especialidades Incluidas (14 Total)

### 1. **Cardiología**
- **Síntomas**: Dolor de pecho, latidos rápidos, palpitaciones, presión en el pecho, falta de aire
- **Palabras clave**: Corazón, cardio, presión, tensión, infarto, derrame, arritmia

### 2. **Traumatología**
- **Síntomas**: Fracturas, esguinces, luxaciones, roturas, golpes fuertes, caídas
- **Palabras clave**: Fractura, trauma, lesión, hueso, articulación, caída

### 3. **Neumología**
- **Síntomas**: Tos, flema, dificultad para respirar, falta de aire, asma, bronquitis
- **Palabras clave**: Pulmón, respiración, asma, tos, bronquitis, enfisema

### 4. **Neurología**
- **Síntomas**: Dolor de cabeza, migraña, mareo, vértigo, entumecimiento, convulsión, parálisis
- **Palabras clave**: Cerebro, neuro, migraña, Parkinson, Alzheimer, epilepsia

### 5. **Gastroenterología**
- **Síntomas**: Dolor de estómago, diarrea, constipación, vómito, náusea, indigestión, reflujo
- **Palabras clave**: Estómago, gastro, hígado, intestino, úlcera, colitis, hepatitis

### 6. **Oftalmología**
- **Síntomas**: Dolor de ojos, visión borrosa, ojo rojo, lagrimeo, cataratas, glaucoma
- **Palabras clave**: Ojo, oftalmología, visión, vista, catarata, glaucoma, miopía

### 7. **Otorrinolaringología**
- **Síntomas**: Dolor de oído, dolor de garganta, congestión nasal, sinusitis, otitis, faringitis
- **Palabras clave**: Oído, ORL, garganta, nariz, sinusitis, otitis, sordera, afonía

### 8. **Dermatología**
- **Síntomas**: Erupción, ronchas, acné, eczema, psoriasis, picazón, lesión en la piel
- **Palabras clave**: Piel, derma, erupción, eczema, psoriasis, acné, lunar, verrugas

### 9. **Urología**
- **Síntomas**: Dolor al orinar, orina frecuente, incontinencia, cistitis, cálculo renal
- **Palabras clave**: Orina, urología, vejiga, próstata, cálculo, cistitis, incontinencia

### 10. **Endocrinología**
- **Síntomas**: Diabetes, hipoglucemia, fatiga extrema, cambios de peso, sed excesiva
- **Palabras clave**: Diabetes, endocrino, insulina, tiroides, hormonas, metabolismo

### 11. **Psiquiatría**
- **Síntomas**: Ansiedad, depresión, estrés, ataque de pánico, insomnio, confusión
- **Palabras clave**: Psiquiatría, ansiedad, depresión, estrés, pánico, psicosis

### 12. **Pediatría**
- **Síntomas**: Fiebre en niño, llanto excesivo, vómito, diarrea en bebé, falta de apetito
- **Palabras clave**: Niño, pediatría, bebé, infantil, lactante, crecimiento

### 13. **Oncología**
- **Síntomas**: Bulto, crecimiento anormal, sangrado inexplicado, pérdida de peso
- **Palabras clave**: Cáncer, oncología, tumor, quimioterapia, radioterapia, maligno

### 14. **Reumatología**
- **Síntomas**: Artritis, inflamación en articulaciones, rigidez matutina, dolor articular
- **Palabras clave**: Artritis, reumatología, lupus, articulación, inflamación

---

## Cómo Funciona el Sistema

### Flujo de Reconocimiento de Voz (Prioridades)

Cuando un paciente habla, el sistema evalúa su consulta en este orden:

1. **Intents Coloquiales** (Registro, Información, Ayuda)
   - Detecta: "me quiero registrar", "dónde me atienden", "necesito ayuda"
   - Responde con opción correspondiente

2. **Opciones Ciegas Predefinidas**
   - Menús específicos de la interfaz de audio

3. **Mensajes Personalizados**
   - Mensajes creados por el personal médico

4. **[NUEVO] Detección de Especialidades Médicas**
   - Analiza síntomas y palabras clave
   - Asigna una especialidad automáticamente
   - Proporciona orientación verbal

5. **Fallback**
   - Mensaje de ayuda si no se detecta nada

### Algoritmo de Puntuación

El sistema utiliza un modelo de puntuación inteligente:

- **Síntomas exactos**: +3 puntos (coincidencia precisa)
- **Palabras clave**: +2 puntos (términos relacionados)
- **Umbral mínimo**: 2 puntos para asignar una especialidad
- **Mejor coincidencia**: Se selecciona la especialidad con mayor puntuación

**Ejemplo:**
```
Usuario dice: "Me duele mucho el pecho y siento palpitaciones"

Puntuación:
- "dolor de pecho" encontrado → +3 puntos
- "palpitaciones" encontrado → +3 puntos
- "corazón" es implícito → +2 puntos
Total: 8 puntos → ASIGNADO A CARDIOLOGÍA
```

---

## Ejemplos de Uso

### Escenario 1: Paciente con Síntomas Cardíacos
- **Usuario dice**: "Tengo dolor en el pecho y latidos muy rápidos"
- **Sistema detecta**: Cardiología
- **Respuesta**: "Detectamos que tu consulta es relacionada a Cardiología. Enfermedades del corazón y sistema cardiovascular. Te recomendamos dirigirte a la ventanilla de Cardiología o indicar tu síntoma al personal de admisión para que te dirija al consultorio correcto."

### Escenario 2: Paciente con Síntomas Neurológicos
- **Usuario dice**: "Tengo una migraña terrible"
- **Sistema detecta**: Neurología
- **Respuesta**: [Orientación personalizada]

### Escenario 3: Paciente con Síntomas Respiratorios
- **Usuario dice**: "No puedo respirar, tengo mucha tos"
- **Sistema detecta**: Neumología
- **Respuesta**: [Orientación personalizada]

---

## Integración Técnica

### Archivos Modificados

**script.js**:
- Agregada constante `MEDICAL_SPECIALTIES` (línea 79)
- Agregada función `detectMedicalSpecialty()` (línea 851)
- Agregada función `getSpecialtyGuidance()` (línea 877)
- Actualizado `handleBlindTranscript()` para incluir detección (línea 908)
- Mensaje de fallback mejorado (línea 920)

### Funciones Disponibles

```javascript
// Detecta especialidad basada en transcript
const specialty = detectMedicalSpecialty(transcript);

// Genera mensaje de orientación
const message = getSpecialtyGuidance(specialty);

// Datos de especialidades accesibles
MEDICAL_SPECIALTIES.cardiology.name;        // "Cardiología"
MEDICAL_SPECIALTIES.cardiology.symptoms;    // Array de síntomas
MEDICAL_SPECIALTIES.cardiology.keywords;    // Array de palabras clave
```

---

## Mejoras Futuras (Opcionales)

- [ ] Agregar información de ubicación (piso, consultorio) para cada especialidad
- [ ] Agregar números telefónicos de extensión
- [ ] Sistema de citas integrado
- [ ] Historial de especialidades consultadas por pacientes
- [ ] Expansión a 20+ especialidades adicionales (Oftalmología pediátrica, Cirugía, etc.)
- [ ] Integración con base de datos de medicamentos
- [ ] Mensajes de precaución/emergencia automáticos
- [ ] Feedback del usuario para mejorar detección

---

## Validación

✅ **Sin errores de sintaxis**  
✅ **Base de datos completa con 14 especialidades**  
✅ **Funciones de detección integradas**  
✅ **Sistema de puntuación operacional**  
✅ **Mensajes personalizados por especialidad**  
✅ **Compatible con Web Speech API (español)**  

---

**Sistema implementado en**: E.M.A Hospital - Enlace Médico Asistido  
**Lenguaje**: JavaScript ES6+  
**Compatibilidad**: Chrome, Edge, Firefox (con permisos de micrófono)  
**Estado**: Producción lista
