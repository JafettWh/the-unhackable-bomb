import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import type { BombRules } from './BombContext';

const firebaseConfig = {
  apiKey: 'AIzaSyA3n5iVkQHdJYIIstclsnFPljDGa1TLoSA',
  authDomain: 'the-unhackable-bomb.firebaseapp.com',
  projectId: 'the-unhackable-bomb',
  storageBucket: 'the-unhackable-bomb.firebasestorage.app',
  messagingSenderId: '708940564954',
  appId: '1:708940564954:web:885bed673a81e579f918e3',
  measurementId: 'G-VDPTJ0QBPK',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export const gameRulesDocument = doc(firestore, 'settings', 'gameRules');

export const observeFirebaseUser = onAuthStateChanged;
export const loginFirebaseUser = signInWithEmailAndPassword;
export const logoutFirebaseUser = signOut;

function isBombRules(value: unknown): value is BombRules {
  if (!value || typeof value !== 'object') return false;

  const rules = value as Partial<BombRules>;
  return Number.isFinite(rules.initialTimeSeconds)
    && Number.isInteger(rules.maxStrikes)
    && Array.isArray(rules.strikePenalties)
    && rules.strikePenalties.length === rules.maxStrikes
    && rules.strikePenalties.every((penalty) =>
      Number.isFinite(penalty?.timePenaltySeconds)
      && Number.isFinite(penalty?.speedMultiplier)
    )
    && Number.isFinite(rules.criticalTimeThresholdSeconds)
    && Number.isFinite(rules.criticalTimeSpeedMultiplier);
}

export async function loadSharedBombRules(): Promise<BombRules | null> {
  const snapshot = await getDoc(gameRulesDocument);
  if (!snapshot.exists()) return null;

  const data: unknown = snapshot.data();
  if (!isBombRules(data)) {
    throw new Error('El documento settings/gameRules tiene un formato inválido.');
  }
  return data;
}

export async function saveSharedBombRules(rules: BombRules): Promise<void> {
  await setDoc(gameRulesDocument, rules);
}