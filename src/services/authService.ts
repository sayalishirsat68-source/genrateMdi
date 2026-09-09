const SESSION_KEY = 'genraticmed.phase3.session';
const DEMO_PIN = '8841';

export function hasClinicalSession(): boolean {
  return window.localStorage.getItem(SESSION_KEY) === 'verified';
}

export function verifyPin(pin: string): boolean {
  if (pin !== DEMO_PIN) return false;
  window.localStorage.setItem(SESSION_KEY, 'verified');
  return true;
}

export async function verifyDevice(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  // Device capability detection is intentionally non-enrolling: production passkeys
  // require a server-issued WebAuthn challenge, which is outside this local demo.
  window.localStorage.setItem(SESSION_KEY, 'verified');
  return true;
}
