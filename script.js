// ===============================
// Datos simulados del sistema
// ===============================
const ADMIN_MESSAGES_KEY = "ema-hospital-admin-messages";
const BLIND_OPTIONS = [
  {
    id: "admission",
    icon: "🏥",
    label: "Registro de paciente",
    description: "Iniciar el registro en admision con apoyo del personal.",
    keywords: ["registro", "admision", "ingreso", "anotarme", "paciente"]
  },
  {
    id: "info",
    icon: "📋",
    label: "Informacion de atencion",
    description: "Escuchar turnos, consultorios e indicaciones generales.",
    keywords: ["informacion", "turno", "consultorio", "atencion", "horario", "indicaciones"]
  },
  {
    id: "help",
    icon: "🚑",
    label: "Solicitar ayuda",
    description: "Llamar al personal de salud para asistencia inmediata.",
    keywords: ["ayuda", "asistencia", "enfermeria", "personal", "urgente", "problema"]
  }
];
const ACCESSIBILITY_CONFIG = {
  blind: {
    label: "Audio",
    screenId: "screen-blind"
  },
  deaf: {
    label: "Texto",
    screenId: "screen-deaf"
  },
  speech: {
    label: "Guiado",
    screenId: "screen-speech"
  }
};
const SHARED_STATE_KEY = "ema-hospital-state";
const savedMessages = loadSavedMessages();

let currentRole = null;
let syncChannel = null;
let blindRecognition = null;
let blindListening = false;
let blindMicPermissionChecked = false;
let preferredFemaleVoice = null;

function scoreVoiceAsFemale(voice) {
  const voiceText = normalizeText(`${voice.name} ${voice.lang}`);
  const femaleHints = ["female", "mujer", "femenina", "paulina", "monica", "helena", "sofia", "maria", "laura"];
  return femaleHints.some((hint) => voiceText.includes(hint));
}

function selectPreferredFemaleVoice() {
  if (!("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();

  if (!Array.isArray(voices) || voices.length === 0) {
    return null;
  }

  const spanishVoices = voices.filter((voice) => (voice.lang || "").toLowerCase().startsWith("es"));
  const voicePool = spanishVoices.length > 0 ? spanishVoices : voices;

  const femaleVoice = voicePool.find((voice) => scoreVoiceAsFemale(voice));
  return femaleVoice || voicePool[0] || null;
}

function initializePreferredVoice() {
  preferredFemaleVoice = selectPreferredFemaleVoice();

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.onvoiceschanged = () => {
    preferredFemaleVoice = selectPreferredFemaleVoice();
  };
}

function loadSavedMessages() {
  const rawMessages = localStorage.getItem(ADMIN_MESSAGES_KEY);

  if (!rawMessages) {
    return [];
  }

  try {
    const parsedMessages = JSON.parse(rawMessages);
    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages.map((message) => normalizeSavedMessage(message));
  } catch {
    return [];
  }
}

function normalizeSavedMessage(message) {
  return {
    id: message.id || `msg-${Date.now()}`,
    title: message.title || "Sin título",
    content: message.content || "",
    type: message.type || "blind",
    section: (message.section || "General").trim(),
    icon: (message.icon || "").trim(),
    keywords: Array.isArray(message.keywords) ? message.keywords : []
  };
}

function persistSavedMessages() {
  localStorage.setItem(ADMIN_MESSAGES_KEY, JSON.stringify(savedMessages));
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSavedMessagesByType(type) {
  return savedMessages.filter((message) => message.type === type);
}

function getMessageSection(message) {
  return (message.section || "General").trim() || "General";
}

function getMessageIcon(message, fallbackIcon) {
  const customIcon = (message.icon || "").trim();
  return customIcon || fallbackIcon;
}

function groupMessagesBySection(messages) {
  return messages.reduce((grouped, message) => {
    const section = getMessageSection(message);

    if (!grouped[section]) {
      grouped[section] = [];
    }

    grouped[section].push(message);
    return grouped;
  }, {});
}

function renderManagedMessageGroups({ container, messages, emptyMessage, fallbackIcon, actionHandler }) {
  if (messages.length === 0) {
    container.innerHTML = `<p class='managed-empty'>${emptyMessage}</p>`;
    return;
  }

  const groupedMessages = groupMessagesBySection(messages);

  container.innerHTML = Object.entries(groupedMessages)
    .map(
      ([section, sectionMessages]) => `
        <div class="managed-group">
          <p class="managed-group-title">${escapeHtml(section)}</p>
          <div class="button-grid single-column managed-group-list">
            ${sectionMessages
              .map(
                (message) => `
                  <button class="big-button managed-message-button" onclick="${actionHandler}('${message.id}')">
                    <span class="icon">${escapeHtml(getMessageIcon(message, fallbackIcon))}</span>
                    <span>
                      <strong>${escapeHtml(message.title)}</strong>
                      <small>${escapeHtml(message.content)}</small>
                    </span>
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      `
    )
    .join("");
}

function getMessageKeywords(message) {
  if (Array.isArray(message.keywords) && message.keywords.length > 0) {
    return message.keywords.map((keyword) => normalizeText(keyword));
  }

  return normalizeText(`${message.title} ${message.content}`)
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function renderManagedMessages() {
  renderBlindManagedMessages();
  renderDeafManagedMessages();
  renderSpeechManagedMessages();
}

function renderBlindManagedMessages() {
  const container = document.getElementById("blind-managed-messages");
  if (!container) return;

  const blindMessages = getSavedMessagesByType("blind");

  renderManagedMessageGroups({
    container,
    messages: blindMessages,
    emptyMessage: "No hay mensajes personalizados para este modo.",
    fallbackIcon: "🔊",
    actionHandler: "handleBlindManagedMessage"
  });
}

function renderDeafManagedMessages() {
  const container = document.getElementById("deaf-managed-messages");
  if (!container) return;

  const deafMessages = getSavedMessagesByType("deaf");

  renderManagedMessageGroups({
    container,
    messages: deafMessages,
    emptyMessage: "No hay mensajes personalizados para este modo.",
    fallbackIcon: "💬",
    actionHandler: "showManagedDeafMessage"
  });
}

function renderSpeechManagedMessages() {
  const container = document.getElementById("speech-managed-messages");
  if (!container) return;

  const speechMessages = getSavedMessagesByType("speech");

  renderManagedMessageGroups({
    container,
    messages: speechMessages,
    emptyMessage: "No hay frases personalizadas para este modo.",
    fallbackIcon: "🗣️",
    actionHandler: "speakManagedSpeechMessage"
  });
}

function getSavedMessageById(messageId) {
  return savedMessages.find((message) => message.id === messageId);
}

// ===============================
// Utilidades de navegación
// ===============================
function goToScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
  }

  closeModal();

  if (screenId === "screen-blind") {
    initializeBlindMode();
  }

}

function getDefaultSharedState() {
  return {
    role: null,
    guestMode: null,
    updatedAt: null
  };
}

function getSharedState() {
  const rawState = localStorage.getItem(SHARED_STATE_KEY);

  if (!rawState) {
    return getDefaultSharedState();
  }

  try {
    return {
      ...getDefaultSharedState(),
      ...JSON.parse(rawState)
    };
  } catch {
    return getDefaultSharedState();
  }
}

function broadcastSharedState(nextState) {
  localStorage.setItem(SHARED_STATE_KEY, JSON.stringify(nextState));

  if (syncChannel) {
    syncChannel.postMessage(nextState);
  }
}

function setDeviceRole(role) {
  currentRole = role;

  if (!role) {
    goToScreen("screen-role");
    return;
  }

  if (role === "reception") {
    goToScreen("screen-reception");
    updateReceptionStatus(getSharedState().guestMode);
    return;
  }

  syncGuestScreen(getSharedState());
}

function activateGuestMode(mode) {
  const nextState = {
    ...getSharedState(),
    guestMode: mode,
    updatedAt: new Date().toISOString()
  };

  broadcastSharedState(nextState);
  updateReceptionStatus(mode);
}

function resetGuestMode() {
  const nextState = {
    ...getSharedState(),
    guestMode: null,
    updatedAt: new Date().toISOString()
  };

  broadcastSharedState(nextState);
  updateReceptionStatus(null);
}

function syncGuestScreen(sharedState) {
  const { guestMode } = sharedState;
  const guestStatus = document.getElementById("guest-status");

  if (!guestMode || !ACCESSIBILITY_CONFIG[guestMode]) {
    if (guestStatus) {
      guestStatus.textContent = "Sin modo activo.";
    }
    goToScreen("screen-guest-waiting");
    return;
  }

  const selectedConfig = ACCESSIBILITY_CONFIG[guestMode];
  if (guestStatus) {
    guestStatus.textContent = `Modo activo: ${selectedConfig.label}.`;
  }

  goToScreen(selectedConfig.screenId);
}

function updateReceptionStatus(mode) {
  const status = document.getElementById("reception-status");

  if (!status) return;

  if (!mode || !ACCESSIBILITY_CONFIG[mode]) {
    status.textContent = "A la espera de una selección.";
    return;
  }

  status.textContent = `La pantalla táctil debe mostrar el modo: ${ACCESSIBILITY_CONFIG[mode].label}.`;
}

function returnGuestHome() {
  stopBlindListening();

  if (currentRole === "guest") {
    resetGuestMode();
    return;
  }

  goToScreen("screen-reception");
}

// ===============================
// SpeechSynthesis API
// ===============================
function speakText(text) {
  if (!("speechSynthesis" in window)) {
    alert("Tu navegador no soporta SpeechSynthesis.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;

  if (!preferredFemaleVoice) {
    preferredFemaleVoice = selectPreferredFemaleVoice();
  }

  if (preferredFemaleVoice) {
    utterance.voice = preferredFemaleVoice;
    utterance.lang = preferredFemaleVoice.lang || "es-ES";
  }

  window.speechSynthesis.speak(utterance);
}

function speakWaitingInstruction() {
  speakText("Hola, soy E.M.A, Enlace Medico Asistido. Estoy listo para adaptar esta pantalla a la forma de comunicacion que necesite. Debe esperar a que recepcion o enfermeria seleccione el modo adecuado para usted.");
}

function handleWaitingScreenTap(event) {
  if (currentRole !== "guest") {
    return;
  }

  const interactiveElement = event.target.closest("button, a, input, textarea, select");
  if (interactiveElement) {
    return;
  }

  speakWaitingInstruction();
}

// ===============================
// Pantalla Audio
// ===============================
function getSpeechRecognitionClass() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function canUseBlindVoiceRecognition() {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const isSecurePage = window.isSecureContext || window.location.protocol === "https:" || isLocalhost;

  if (window.location.protocol === "file:") {
    return {
      supported: false,
      message: "El control por voz no funciona bien abierto como archivo local. Abra la demo desde localhost o HTTPS y permita el micrófono."
    };
  }

  if (!isSecurePage) {
    return {
      supported: false,
      message: "El control por voz necesita una página segura. Abra la demo desde localhost o HTTPS."
    };
  }

  return {
    supported: true,
    message: ""
  };
}

function getBlindRecognitionErrorMessage(errorCode) {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "El micrófono fue bloqueado. Permita acceso al micrófono para este sitio en Chrome/Edge y vuelva a intentarlo.";
    case "audio-capture":
      return "No encontré un micrófono disponible en este dispositivo.";
    case "no-speech":
      return "No detecté voz. Toque de nuevo y hable apenas empiece la escucha.";
    case "network":
      return "El reconocimiento de voz falló por red. Revise la conexión e inténtelo otra vez.";
    case "aborted":
      return "La escucha se canceló antes de tiempo. Puede tocar de nuevo para reintentarlo.";
    case "language-not-supported":
      return "El idioma de reconocimiento no está disponible en este navegador.";
    default:
      return "No pude escuchar la consulta. Toque de nuevo para intentarlo o use un acceso rápido.";
  }
}

function setBlindVoiceStatus(text) {
  const status = document.getElementById("blind-voice-status");

  if (status) {
    status.textContent = text;
  }
}

function updateBlindVoiceButton() {
  const button = document.getElementById("blind-voice-button");

  if (!button) {
    return;
  }

  button.classList.toggle("listening", blindListening);
  button.setAttribute("aria-pressed", blindListening ? "true" : "false");
}

function initializeBlindMode() {
  stopBlindListening();
  setBlindVoiceStatus("Listo para escuchar. Puede decir: quiero registrarme, informacion de atencion o necesito asistencia.");
  updateBlindVoiceButton();
  speakWelcomeBlind();
}

function ensureBlindRecognition() {
  if (blindRecognition) {
    return blindRecognition;
  }

  const SpeechRecognitionClass = getSpeechRecognitionClass();
  if (!SpeechRecognitionClass) {
    return null;
  }

  blindRecognition = new SpeechRecognitionClass();
  blindRecognition.lang = "es-ES";
  blindRecognition.continuous = false;
  blindRecognition.interimResults = true;

  blindRecognition.addEventListener("start", () => {
    blindListening = true;
    updateBlindVoiceButton();
    setBlindVoiceStatus("Escuchando. Haga su consulta ahora.");
  });

  blindRecognition.addEventListener("result", (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ")
      .trim();

    if (!transcript) {
      return;
    }

    const lastResult = event.results[event.results.length - 1];
    if (lastResult.isFinal) {
      setBlindVoiceStatus(`Escuché: ${transcript}`);
      handleBlindTranscript(transcript);
      return;
    }

    setBlindVoiceStatus(`Escuchando: ${transcript}`);
  });

  blindRecognition.addEventListener("error", (event) => {
    blindListening = false;
    updateBlindVoiceButton();

    const errorMessage = getBlindRecognitionErrorMessage(event.error);
    setBlindVoiceStatus(errorMessage);
    speakText(errorMessage);
  });

  blindRecognition.addEventListener("end", () => {
    blindListening = false;
    updateBlindVoiceButton();
  });

  return blindRecognition;
}

async function ensureBlindMicPermission() {
  if (blindMicPermissionChecked) {
    return true;
  }

  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    blindMicPermissionChecked = true;
    return true;
  } catch {
    const permissionMessage = "No se pudo habilitar el micrófono. Revise permisos del navegador y del sistema operativo.";
    setBlindVoiceStatus(permissionMessage);
    speakText(permissionMessage);
    return false;
  }
}

function normalizeTranscript(text) {
  return normalizeText(text);
}

function findBlindOptionByTranscript(transcript) {
  const normalizedTranscript = normalizeTranscript(transcript);

  return BLIND_OPTIONS.find((option) =>
    option.keywords.some((keyword) => normalizedTranscript.includes(keyword))
  );
}

function findBlindManagedMessageByTranscript(transcript) {
  const normalizedTranscript = normalizeTranscript(transcript);
  const blindMessages = getSavedMessagesByType("blind");

  return blindMessages.find((message) =>
    getMessageKeywords(message).some((keyword) => normalizedTranscript.includes(keyword))
  );
}

function handleBlindTranscript(transcript) {
  const matchedOption = findBlindOptionByTranscript(transcript);

  if (matchedOption) {
    handleBlindOption(matchedOption.id);
    return;
  }

  const matchedManagedMessage = findBlindManagedMessageByTranscript(transcript);
  if (matchedManagedMessage) {
    handleBlindManagedMessage(matchedManagedMessage.id);
    return;
  }

  const fallbackMessage = "No entendi la consulta. Puede decir registro, informacion de atencion o ayuda.";
  if (getSavedMessagesByType("blind").length > 0) {
    const extended = fallbackMessage + " Tambien puede nombrar alguno de los mensajes del personal medico que aparecen en pantalla.";
    setBlindVoiceStatus(extended);
    speakText(extended);
  } else {
    setBlindVoiceStatus(fallbackMessage);
    speakText(fallbackMessage);
  }
}

async function startBlindListening() {
  const voiceSupport = canUseBlindVoiceRecognition();
  if (!voiceSupport.supported) {
    setBlindVoiceStatus(voiceSupport.message);
    speakText(voiceSupport.message);
    return;
  }

  const recognition = ensureBlindRecognition();

  if (!recognition) {
    const fallbackMessage = "Este navegador no permite preguntas por voz. Pruebe con Chrome o Edge, o use los accesos rápidos grandes de abajo.";
    setBlindVoiceStatus(fallbackMessage);
    speakText(fallbackMessage);
    return;
  }

  const permissionGranted = await ensureBlindMicPermission();
  if (!permissionGranted) {
    return;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  try {
    recognition.start();
  } catch (error) {
    const isAlreadyRunning = error && error.name === "InvalidStateError";
    const busyMessage = isAlreadyRunning
      ? "La escucha ya está en curso. Hable ahora o toque una vez para detener."
      : "La escucha de voz no pudo iniciarse en este momento. Espere un segundo y vuelva a intentarlo.";
    setBlindVoiceStatus(busyMessage);
    if (!isAlreadyRunning) {
      speakText(busyMessage);
    }
  }
}

function stopBlindListening() {
  if (!blindRecognition || !blindListening) {
    blindListening = false;
    updateBlindVoiceButton();
    return;
  }

  blindRecognition.stop();
}

async function toggleBlindListening() {
  if (blindListening) {
    stopBlindListening();
    setBlindVoiceStatus("Escucha detenida. Toque otra vez para hablar.");
    speakText("Escucha detenida.");
    return;
  }

  await startBlindListening();
}

function handleBlindCardTap(event) {
  const interactive = event.target.closest("button, a, input, textarea, select");
  if (interactive) return;
  toggleBlindListening();
}

function handleBlindOption(option) {
  let message = "";
  let statusMessage = "";

  switch (option) {
    case "admission":
      message = "Ha seleccionado registro de paciente. Un miembro del personal le asistira con la admision.";
      statusMessage = "Consulta detectada: registro de paciente.";
      break;
    case "info":
      message = "Ha seleccionado informacion de atencion. Puede consultar turnos, consultorios e indicaciones generales.";
      statusMessage = "Consulta detectada: informacion de atencion.";
      break;
    case "help":
      message = "Ha solicitado asistencia. El personal de salud acudira de inmediato.";
      statusMessage = "Consulta detectada: asistencia inmediata.";
      break;
    default:
      message = "No pude identificar la opcion seleccionada. Intente nuevamente con una opcion valida.";
      statusMessage = "Opcion no reconocida.";
      break;
  }

  if (statusMessage) {
    setBlindVoiceStatus(statusMessage);
  }

  speakText(message);
}

function handleBlindManagedMessage(messageId) {
  const managedMessage = getSavedMessageById(messageId);
  if (!managedMessage) return;

  setBlindVoiceStatus(`Consulta detectada: ${managedMessage.title}.`);
  speakText(managedMessage.content);
}

function showManagedDeafMessage(messageId) {
  const managedMessage = getSavedMessageById(messageId);
  if (!managedMessage) return;

  showVisualMessage(managedMessage.title, managedMessage.content);
}

function speakManagedSpeechMessage(messageId) {
  const managedMessage = getSavedMessageById(messageId);
  if (!managedMessage) return;

  speakForUser(managedMessage.content);
}

function speakWelcomeBlind() {
  speakText("Ha ingresado al modo audio. Puede tocar la pantalla en cualquier parte para hablar con E.M.A. Diga: registro, informacion de atencion, o necesito ayuda.");
}

// ===============================
// Pantalla Visual
// ===============================
function showVisualMessage(title, text) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");

  if (!modal || !modalTitle || !modalText) {
    return;
  }

  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (!modal) {
    return;
  }

  modal.classList.add("hidden");
}

// ===============================
// Pantalla Guiado
// ===============================
function speakForUser(text) {
  const output = document.getElementById("speech-output");
  output.textContent = `Mensaje seleccionado: "${text}"`;
  speakText(text);
}

function speakCustomNarratorText() {
  const input = document.getElementById("speech-custom-text");
  const output = document.getElementById("speech-output");

  if (!input || !output) {
    return;
  }

  const customText = input.value.trim();

  if (!customText) {
    output.textContent = "Escriba un texto para que el narrador pueda leerlo.";
    return;
  }

  speakForUser(customText);
}

// ===============================
// Panel de administrador
// ===============================
function renderSavedMessages() {
  const container = document.getElementById("saved-messages");

  if (!container) return;

  if (savedMessages.length === 0) {
    container.innerHTML = "<p class='subtitle'>No hay mensajes guardados aún.</p>";
    return;
  }

  container.innerHTML = savedMessages
    .map(
      (msg) => `
        <div class="saved-item">
          <strong>${escapeHtml(msg.title)}</strong>
          <p>${escapeHtml(msg.content)}</p>
          <small>Apartado: ${escapeHtml(getMessageSection(msg))}</small>
          <small>Icono: ${escapeHtml(getMessageIcon(msg, "(predeterminado)"))}</small>
          <small>Tipo: ${escapeHtml(msg.type)}</small>
          <small>Palabras clave: ${escapeHtml((msg.keywords || []).join(", ") || "sin configurar")}</small>
        </div>
      `
    )
    .join("");
}

function handleAdminSubmit(event) {
  event.preventDefault();

  const title = document.getElementById("admin-title").value.trim();
  const content = document.getElementById("admin-content").value.trim();
  const type = document.getElementById("admin-type").value;
  const section = document.getElementById("admin-section").value.trim() || "General";
  const icon = document.getElementById("admin-icon").value.trim().slice(0, 12);
  const keywords = document.getElementById("admin-keywords").value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  if (!title || !content) return;

  savedMessages.push({
    id: `msg-${Date.now()}`,
    title,
    content,
    type,
    section,
    icon,
    keywords
  });

  persistSavedMessages();

  document.getElementById("admin-form").reset();
  renderSavedMessages();
  renderManagedMessages();

  showVisualMessage("Mensaje guardado", "El mensaje fue agregado correctamente al panel de administracion E.M.A.");
}

// ===============================
// Inicialización
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  initializePreferredVoice();

  if ("BroadcastChannel" in window) {
    syncChannel = new BroadcastChannel("ema-hospital-sync");
    syncChannel.addEventListener("message", (event) => {
      if (currentRole === "guest") {
        syncGuestScreen(event.data);
      }

      if (currentRole === "reception") {
        updateReceptionStatus(event.data.guestMode);
      }
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== SHARED_STATE_KEY || !event.newValue) {
      return;
    }

    let parsedState = null;

    try {
      parsedState = JSON.parse(event.newValue);
    } catch {
      return;
    }

    if (currentRole === "guest") {
      syncGuestScreen(parsedState);
    }

    if (currentRole === "reception") {
      updateReceptionStatus(parsedState.guestMode);
    }
  });

  goToScreen("screen-role");

  const adminForm = document.getElementById("admin-form");
  if (adminForm) {
    adminForm.addEventListener("submit", handleAdminSubmit);
  }

  renderSavedMessages();
  renderManagedMessages();
});