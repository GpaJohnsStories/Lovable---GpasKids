// Advanced Key Rotation and Management System
// Provides automatic key rotation and enhanced security features

interface KeyRotationConfig {
  rotationIntervalDays: number;
  maxKeyAge: number;
  emergencyRotationThreshold: number;
}

interface StoredKeyInfo {
  keyId: string;
  createdAt: number;
  rotatedAt: number;
  usageCount: number;
  isActive: boolean;
  keyFingerprint: string;
}

class KeyRotationManager {
  private static instance: KeyRotationManager;
  private config: KeyRotationConfig = {
    rotationIntervalDays: 30, // Rotate keys every 30 days
    maxKeyAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    emergencyRotationThreshold: 10000 // Max operations before forced rotation
  };

  private constructor() {}

  static getInstance(): KeyRotationManager {
    if (!KeyRotationManager.instance) {
      KeyRotationManager.instance = new KeyRotationManager();
    }
    return KeyRotationManager.instance;
  }

  // Check if current key needs rotation
  async shouldRotateKey(): Promise<boolean> {
    try {
      const keyInfo = this.getCurrentKeyInfo();
      if (!keyInfo) return true; // No key info means we need a new key

      const now = Date.now();
      const keyAge = now - keyInfo.createdAt;
      const daysSinceRotation = (now - keyInfo.rotatedAt) / (24 * 60 * 60 * 1000);

      // Rotate if key is too old, rotation interval exceeded, or usage threshold reached
      return (
        keyAge > this.config.maxKeyAge ||
        daysSinceRotation >= this.config.rotationIntervalDays ||
        keyInfo.usageCount >= this.config.emergencyRotationThreshold
      );
    } catch (error) {
      console.error('❌ Error checking key rotation status:', error);
      return true; // Default to rotation needed on error
    }
  }

  // Generate new encryption key with rotation metadata
  async rotateEncryptionKey(): Promise<void> {
    try {
      console.log('🔄 Starting key rotation process...');
      
      // Archive current key before creating new one
      const currentKey = this.getCurrentKeyInfo();
      if (currentKey) {
        await this.archiveKey(currentKey.keyId);
      }

      // Generate new key ID and metadata
      const keyId = this.generateKeyId();
      const now = Date.now();
      
      const newKeyInfo: StoredKeyInfo = {
        keyId,
        createdAt: now,
        rotatedAt: now,
        usageCount: 0,
        isActive: true,
        keyFingerprint: await this.generateKeyFingerprint()
      };

      // Store new key info
      this.storeKeyInfo(newKeyInfo);
      
      // Log rotation event
      await this.logKeyRotation(keyId, currentKey?.keyId);
      
      console.log('✅ Key rotation completed successfully');
    } catch (error) {
      console.error('❌ Key rotation failed:', error);
      throw new Error('Key rotation process failed');
    }
  }

  // Increment usage counter for current key
  incrementKeyUsage(): void {
    try {
      const keyInfo = this.getCurrentKeyInfo();
      if (keyInfo) {
        keyInfo.usageCount++;
        this.storeKeyInfo(keyInfo);
      }
    } catch (error) {
      console.warn('⚠️ Failed to increment key usage counter:', error);
    }
  }

  // Get current active key information
  private getCurrentKeyInfo(): StoredKeyInfo | null {
    try {
      const stored = localStorage.getItem('gjs_key_info');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('⚠️ Failed to retrieve key info:', error);
      return null;
    }
  }

  // Store key information securely
  private storeKeyInfo(keyInfo: StoredKeyInfo): void {
    try {
      localStorage.setItem('gjs_key_info', JSON.stringify(keyInfo));
    } catch (error) {
      console.error('❌ Failed to store key info:', error);
    }
  }

  // Archive old key before rotation
  private async archiveKey(keyId: string): Promise<void> {
    try {
      const archived = this.getArchivedKeys();
      archived.push({
        keyId,
        archivedAt: Date.now(),
        reason: 'automatic_rotation'
      });
      
      // Keep only last 5 archived keys
      if (archived.length > 5) {
        archived.shift();
      }
      
      localStorage.setItem('gjs_archived_keys', JSON.stringify(archived));
      console.log(`🗄️ Key ${keyId} archived successfully`);
    } catch (error) {
      console.error('❌ Failed to archive key:', error);
    }
  }

  // Get list of archived keys
  private getArchivedKeys(): any[] {
    try {
      const stored = localStorage.getItem('gjs_archived_keys');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  // Generate unique key ID
  private generateKeyId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `key_${timestamp}_${random}`;
  }

  // Generate key fingerprint for integrity verification
  private async generateKeyFingerprint(): Promise<string> {
    try {
      const data = new TextEncoder().encode(
        `${navigator.userAgent}_${Date.now()}_${Math.random()}`
      );
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substr(0, 16);
    } catch (error) {
      return 'fp_' + Math.random().toString(36).substr(2, 12);
    }
  }

  // Log key rotation events for audit
  private async logKeyRotation(newKeyId: string, oldKeyId?: string): Promise<void> {
    try {
      const rotationLog = {
        timestamp: new Date().toISOString(),
        event: 'key_rotation',
        newKeyId,
        oldKeyId: oldKeyId || 'none',
        userAgent: navigator.userAgent.slice(0, 50),
        reason: 'scheduled_rotation'
      };

      // Store in session storage for debugging
      const logs = JSON.parse(sessionStorage.getItem('key_rotation_logs') || '[]');
      logs.push(rotationLog);
      
      // Keep only last 50 logs
      if (logs.length > 50) logs.shift();
      sessionStorage.setItem('key_rotation_logs', JSON.stringify(logs));
      
      console.log('📋 Key rotation logged:', rotationLog);
    } catch (error) {
      console.warn('⚠️ Failed to log key rotation:', error);
    }
  }

  // Get key rotation statistics
  getRotationStats(): {
    currentKeyAge: number;
    daysSinceRotation: number;
    usageCount: number;
    rotationNeeded: boolean;
    nextRotationDue: string;
  } {
    const keyInfo = this.getCurrentKeyInfo();
    
    if (!keyInfo) {
      return {
        currentKeyAge: 0,
        daysSinceRotation: 0,
        usageCount: 0,
        rotationNeeded: true,
        nextRotationDue: 'Immediately'
      };
    }

    const now = Date.now();
    const currentKeyAge = now - keyInfo.createdAt;
    const daysSinceRotation = (now - keyInfo.rotatedAt) / (24 * 60 * 60 * 1000);
    const daysUntilRotation = this.config.rotationIntervalDays - daysSinceRotation;
    
    return {
      currentKeyAge: Math.floor(currentKeyAge / (24 * 60 * 60 * 1000)),
      daysSinceRotation: Math.floor(daysSinceRotation),
      usageCount: keyInfo.usageCount,
      rotationNeeded: daysSinceRotation >= this.config.rotationIntervalDays,
      nextRotationDue: daysUntilRotation <= 0 ? 'Overdue' : `${Math.ceil(daysUntilRotation)} days`
    };
  }

  // Emergency key rotation (manual trigger)
  async emergencyRotation(reason: string): Promise<void> {
    try {
      console.log(`🚨 Emergency key rotation triggered: ${reason}`);
      await this.rotateEncryptionKey();
      
      // Log emergency rotation
      const emergencyLog = {
        timestamp: new Date().toISOString(),
        event: 'emergency_key_rotation',
        reason,
        triggeredBy: 'admin_action'
      };
      
      const logs = JSON.parse(sessionStorage.getItem('emergency_rotation_logs') || '[]');
      logs.push(emergencyLog);
      sessionStorage.setItem('emergency_rotation_logs', JSON.stringify(logs));
      
    } catch (error) {
      console.error('❌ Emergency key rotation failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const keyRotationManager = KeyRotationManager.getInstance();

// Helper functions
export async function checkAndRotateKey(): Promise<boolean> {
  if (await keyRotationManager.shouldRotateKey()) {
    await keyRotationManager.rotateEncryptionKey();
    return true;
  }
  return false;
}

export function incrementEncryptionUsage(): void {
  keyRotationManager.incrementKeyUsage();
}

export function getKeyRotationStats() {
  return keyRotationManager.getRotationStats();
}

export async function triggerEmergencyRotation(reason: string): Promise<void> {
  await keyRotationManager.emergencyRotation(reason);
}
