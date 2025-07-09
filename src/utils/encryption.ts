// Enhanced Application-Level Encryption Utilities
// Provides client-side encryption for sensitive data before database storage
import { checkAndRotateKey, incrementEncryptionUsage } from './keyRotation';
import { reportEncryptionFailure, detectSuspiciousActivity } from './threatDetection';

class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: CryptoKey | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Simplified initialization - try the full version first, then fallback
      try {
        // Check if key rotation is needed
        await checkAndRotateKey();
      } catch (error) {
        console.warn('⚠️ Key rotation check failed, continuing with simple initialization:', error);
      }
      
      // Derive encryption key from a combination of browser-specific data
      // This creates a unique key per browser/device for additional security
      const keyMaterial = await this.deriveKeyMaterial();
      this.encryptionKey = await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
      this.initialized = true;
      console.log('🔐 Encryption service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize encryption service:', error);
      try {
        // Try to report the failure, but don't let it break initialization
        reportEncryptionFailure('encryption_initialization', error as Error);
      } catch (reportError) {
        console.warn('⚠️ Could not report encryption failure:', reportError);
      }
      throw new Error('Encryption initialization failed');
    }
  }

  private async deriveKeyMaterial(): Promise<ArrayBuffer> {
    // Create a consistent key material from browser characteristics
    const encoder = new TextEncoder();
    
    // Combine various browser-specific data for key derivation
    const browserData = [
      navigator.userAgent.slice(0, 50), // Partial user agent
      window.screen.width.toString(),
      window.screen.height.toString(),
      navigator.language,
      'grandpa-john-stories-encryption-2025' // Application-specific salt
    ].join('|');

    const data = encoder.encode(browserData);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return hashBuffer;
  }

  async encryptText(plaintext: string): Promise<string> {
    if (!this.initialized || !this.encryptionKey) {
      throw new Error('Encryption service not initialized');
    }

    try {
      // Try to increment usage counter for key rotation monitoring, but don't fail if it doesn't work
      try {
        incrementEncryptionUsage();
      } catch (usageError) {
        console.warn('⚠️ Could not increment encryption usage:', usageError);
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);
      
      // Generate a random IV for each encryption
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        data
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to base64 for safe storage
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('❌ Encryption failed:', error);
      try {
        reportEncryptionFailure('text_encryption', error as Error);
      } catch (reportError) {
        console.warn('⚠️ Could not report encryption failure:', reportError);
      }
      throw new Error('Data encryption failed');
    }
  }

  async decryptText(encryptedData: string): Promise<string> {
    if (!this.initialized || !this.encryptionKey) {
      throw new Error('Encryption service not initialized');
    }

    try {
      // Decode from base64
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(c => c.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      // Return original data if decryption fails (backward compatibility)
      return encryptedData;
    }
  }

  async encryptPersonalId(personalId: string): Promise<string> {
    // Add prefix to identify encrypted personal IDs
    const encrypted = await this.encryptText(personalId);
    return `enc_${encrypted}`;
  }

  async decryptPersonalId(encryptedPersonalId: string): Promise<string> {
    // Check if it's encrypted (has prefix)
    if (encryptedPersonalId.startsWith('enc_')) {
      const encryptedData = encryptedPersonalId.slice(4);
      return await this.decryptText(encryptedData);
    }
    // Return as-is if not encrypted (backward compatibility)
    return encryptedPersonalId;
  }

  // Utility method to check if data appears to be encrypted
  isEncrypted(data: string): boolean {
    return data.startsWith('enc_') || this.looksLikeBase64(data);
  }

  private looksLikeBase64(str: string): boolean {
    // Simple heuristic to detect base64-encoded data
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length > 50; // Encrypted data should be reasonably long
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

// Helper functions for easy use
export async function initializeEncryption(): Promise<void> {
  await encryptionService.initialize();
}

export async function encryptSensitiveData(data: string): Promise<string> {
  return await encryptionService.encryptText(data);
}

export async function decryptSensitiveData(encryptedData: string): Promise<string> {
  return await encryptionService.decryptText(encryptedData);
}

export async function encryptPersonalId(personalId: string): Promise<string> {
  return await encryptionService.encryptPersonalId(personalId);
}

export async function decryptPersonalId(encryptedPersonalId: string): Promise<string> {
  return await encryptionService.decryptPersonalId(encryptedPersonalId);
}

// Security audit function
export function getEncryptionStatus(): {
  initialized: boolean;
  browserSupport: boolean;
  securityLevel: 'high' | 'medium' | 'low';
} {
  const browserSupport = !!(window.crypto && window.crypto.subtle);
  
  let securityLevel: 'high' | 'medium' | 'low' = 'low';
  if (browserSupport && window.isSecureContext) {
    securityLevel = 'high';
  } else if (browserSupport) {
    securityLevel = 'medium';
  }

  return {
    initialized: encryptionService['initialized'],
    browserSupport,
    securityLevel
  };
}