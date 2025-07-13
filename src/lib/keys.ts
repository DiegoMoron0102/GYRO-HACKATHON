import { Keypair } from '@stellar/stellar-sdk';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Capacitor } from '@capacitor/core';

const STORAGE_KEY = 'stellarKeys';
const enc = new TextEncoder();
const dec = new TextDecoder();

/* ─ helpers ─ */
async function deriveKey(pin: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/* ─ API ─ */

/** Genera par de claves y guarda el secreto cifrado. *No* fondea la cuenta. */
export async function createAccount(pin: string): Promise<string> {
  const kp = Keypair.random();
  const secret = kp.secret();
  const pub = kp.publicKey();

  await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(pub)}`);
  
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aes = await deriveKey(pin, salt);

  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, enc.encode(secret));

  const payload = JSON.stringify({
    c: Array.from(new Uint8Array(cipher)),
    s: Array.from(salt),
    i: Array.from(iv),
    p: pub,
  });

  if (Capacitor.isNativePlatform()) {
    await SecureStoragePlugin.set({ key: STORAGE_KEY, value: payload });
  } else {
    localStorage.setItem(`${STORAGE_KEY}_dev`, payload);
  }

  return pub;
}

export async function loadSecret(pin: string): Promise<string> {
  const raw = Capacitor.isNativePlatform()
    ? (await SecureStoragePlugin.get({ key: STORAGE_KEY })).value
    : localStorage.getItem(`${STORAGE_KEY}_dev`);
  if (!raw) throw new Error('No hay claves almacenadas');

  const { c, s, i } = JSON.parse(raw) as { c: number[]; s: number[]; i: number[] };
  const aes = await deriveKey(pin, new Uint8Array(s));
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(i) },
    aes,
    new Uint8Array(c)
  );
  return dec.decode(plain);
}

export async function getPublicKey(): Promise<string | null> {
  const raw = Capacitor.isNativePlatform()
    ? (await SecureStoragePlugin.get({ key: STORAGE_KEY })).value
    : localStorage.getItem(`${STORAGE_KEY}_dev`);
  return raw ? (JSON.parse(raw) as { p: string }).p : null;
}

export async function deleteKeys(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await SecureStoragePlugin.remove({ key: STORAGE_KEY });
  } else {
    localStorage.removeItem(`${STORAGE_KEY}_dev`);
  }
}
