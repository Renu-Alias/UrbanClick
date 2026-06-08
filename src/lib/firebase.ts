import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let appInstance = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let isConfigured = false;

// Check if we have valid non-empty config
if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(appInstance, firebaseConfig.firestoreDatabaseId || undefined);
    authInstance = getAuth(appInstance);
    isConfigured = true;
    console.log('Firebase services initialized successfully on UrbanClick architecture.');
    
    // Validate connection to Firestore as required by SKILL.md
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(dbInstance!, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('offline'))) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error('Failed to initialize Firebase services:', error);
  }
} else {
  console.log('Empty profile on firebase-applet-config.json. Operating in client-side high-fidelity fallback persistence mode.');
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;

/**
 * Checks whether Firebase is fully configured with active cloud connection credentials.
 */
export function isFirebaseReady(): boolean {
  return isConfigured && dbInstance !== null && authInstance !== null;
}

/**
 * Standardized Zero-Trust Firebase Error Handler
 * Mandated by the developer-integration skill to serialize failure parameters for live logging.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = authInstance;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Hardened Gate Exception: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
