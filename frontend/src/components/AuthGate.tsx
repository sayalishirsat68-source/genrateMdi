import React, { useState } from 'react';
import { verifyDevice, verifyPin } from '../services/authService';

export function AuthGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const submitPin = () => {
    if (verifyPin(pin)) onAuthenticated();
    else setError('Incorrect PIN. Use the demo ABHA PIN ending in 8841.');
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-primary/80 p-4 backdrop-blur-sm">
      <form onSubmit={(event) => { event.preventDefault(); submitPin(); }} className="w-full max-w-sm rounded-2xl border border-border-crisp bg-surface-card p-6 shadow-2xl">
        <span className="material-symbols-outlined text-3xl text-secondary">verified_user</span>
        <h1 className="mt-3 text-lg font-bold text-on-surface">Unlock Rx Vault</h1>
        <p className="mt-1 text-xs text-on-surface-variant">Verify your ABHA session to view clinical data. Demo PIN: 8841.</p>
        <label className="mt-5 block text-xs font-semibold text-on-surface" htmlFor="vault-pin">ABHA PIN</label>
        <input id="vault-pin" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" type="password" className="mt-1 w-full rounded-xl border border-border-crisp bg-surface-canvas p-3 text-center font-mono tracking-[0.5em] outline-none focus:border-secondary" />
        {error && <p className="mt-2 text-xs text-status-critical">{error}</p>}
        <button type="submit" className="mt-4 w-full rounded-xl bg-secondary py-3 text-xs font-semibold text-white">Verify & Continue</button>
        {'PublicKeyCredential' in window && <button type="button" onClick={() => void verifyDevice().then((ok) => ok ? onAuthenticated() : setError('Biometric verification is unavailable on this device.'))} className="mt-2 w-full rounded-xl border border-border-crisp py-3 text-xs font-semibold text-on-surface">Use device biometric</button>}
      </form>
    </div>
  );
}
