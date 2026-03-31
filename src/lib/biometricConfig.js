const MAX_BIOMETRIC_SLOTS = 3;
const DEVICE_ID_KEY = "biometricDeviceId";
const LAST_USERNAME_KEY = "lastLoginUsername";

const EMPTY_CONFIG = {
  prompted: false,
  slots: [false, false, false],
  credentialIds: [],
};

function toBase64Url(uint8Array) {
  let binary = "";
  for (let i = 0; i < uint8Array.length; i += 1) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4 || 4)) % 4)}`;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getDeviceId() {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const generated = crypto?.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(DEVICE_ID_KEY, generated);
  return generated;
}

async function callBiometricApi(payload) {
  const response = await fetch("/api/biometric", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || "Error al procesar biometría.");
  }
  return data;
}

export function isBiometricSupported() {
  return (
    typeof window !== "undefined" &&
    typeof PublicKeyCredential !== "undefined" &&
    !!navigator?.credentials
  );
}

export function isMobileOrTablet() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua);
}

export function setLastLoginUsername(username) {
  if (typeof window === "undefined" || !username) return;
  localStorage.setItem(LAST_USERNAME_KEY, username);
}

export function getLastLoginUsername() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LAST_USERNAME_KEY) || "";
}

export async function getBiometricConfig(username) {
  if (!username || typeof window === "undefined") return { ...EMPTY_CONFIG };
  const deviceId = getDeviceId();
  const data = await callBiometricApi({ action: "status", username, deviceId });
  return data?.config || { ...EMPTY_CONFIG };
}

export async function markBiometricPrompted(username) {
  if (!username || typeof window === "undefined") return { ...EMPTY_CONFIG };
  const deviceId = getDeviceId();
  const data = await callBiometricApi({
    action: "mark_prompted",
    username,
    deviceId,
  });
  return data?.config || { ...EMPTY_CONFIG };
}

export async function configureBiometricNextSlot(username) {
  if (!isBiometricSupported()) {
    throw new Error("Este celular o navegador no soporta huella digital.");
  }

  const current = await getBiometricConfig(username);
  const nextSlot = current.slots.findIndex((enabled) => !enabled);
  if (nextSlot === -1) {
    throw new Error("Ya tenés las 3 huellas habilitadas.");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "JLA" },
      user: {
        id: userId,
        name: `${username}`,
        displayName: `${username}`,
      },
      pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
      excludeCredentials: current.credentialIds.map((id) => ({
        id: fromBase64Url(id),
        type: "public-key",
      })),
    },
  });

  if (!credential?.rawId) {
    throw new Error("No se pudo registrar la huella digital.");
  }

  const credentialId = toBase64Url(new Uint8Array(credential.rawId));
  const deviceId = getDeviceId();
  const data = await callBiometricApi({
    action: "register",
    username,
    deviceId,
    credentialId,
  });
  const updated = data?.config || { ...EMPTY_CONFIG };
  const total = updated.slots.filter(Boolean).length;

  return {
    slot: nextSlot + 1,
    total,
    max: MAX_BIOMETRIC_SLOTS,
    config: updated,
  };
}

export async function authenticateBiometricLogin(username) {
  if (!username) {
    throw new Error("Ingresá un usuario para usar huella.");
  }
  if (!isBiometricSupported()) {
    throw new Error("Este dispositivo no soporta huella digital.");
  }

  const config = await getBiometricConfig(username);
  if (!config.credentialIds?.length) {
    throw new Error("Este dispositivo no tiene huellas configuradas.");
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: config.credentialIds.map((id) => ({
        id: fromBase64Url(id),
        type: "public-key",
      })),
      userVerification: "required",
      timeout: 60000,
    },
  });

  if (!assertion?.rawId) {
    throw new Error("No se pudo autenticar con huella.");
  }

  const credentialId = toBase64Url(new Uint8Array(assertion.rawId));
  const deviceId = getDeviceId();
  const data = await callBiometricApi({
    action: "login_with_credential",
    username,
    deviceId,
    credentialId,
  });

  return data;
}

export async function clearBiometricData(username) {
  if (!username || typeof window === "undefined") return { ...EMPTY_CONFIG };
  const deviceId = getDeviceId();
  const data = await callBiometricApi({ action: "clear", username, deviceId });
  return data?.config || { ...EMPTY_CONFIG };
}
