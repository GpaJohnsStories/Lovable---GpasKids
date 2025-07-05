// Advanced Threat Detection and Security Monitoring
// Detects suspicious activities and potential security threats

interface ThreatEvent {
  id: string;
  timestamp: number;
  type: 'suspicious_activity' | 'encryption_failure' | 'key_compromise' | 'unusual_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
  resolved: boolean;
}

interface SecurityMetrics {
  encryptionFailures: number;
  suspiciousAttempts: number;
  keyRotationEvents: number;
  lastThreatDetected: number | null;
  securityScore: number;
}

class ThreatDetectionSystem {
  private static instance: ThreatDetectionSystem;
  private threatEvents: ThreatEvent[] = [];
  private securityMetrics: SecurityMetrics = {
    encryptionFailures: 0,
    suspiciousAttempts: 0,
    keyRotationEvents: 0,
    lastThreatDetected: null,
    securityScore: 100
  };

  private constructor() {
    this.loadStoredData();
    this.startMonitoring();
  }

  static getInstance(): ThreatDetectionSystem {
    if (!ThreatDetectionSystem.instance) {
      ThreatDetectionSystem.instance = new ThreatDetectionSystem();
    }
    return ThreatDetectionSystem.instance;
  }

  // Detect encryption failures
  reportEncryptionFailure(context: string, error: Error): void {
    this.securityMetrics.encryptionFailures++;
    
    const threat: ThreatEvent = {
      id: this.generateThreatId(),
      timestamp: Date.now(),
      type: 'encryption_failure',
      severity: 'medium',
      description: `Encryption failure detected in ${context}`,
      metadata: {
        context,
        error: error.message,
        userAgent: navigator.userAgent.slice(0, 50),
        url: window.location.href
      },
      resolved: false
    };

    this.addThreatEvent(threat);
    this.updateSecurityScore();
    console.warn('🚨 Encryption failure detected:', threat);
  }

  // Detect suspicious access patterns
  detectSuspiciousActivity(activity: {
    type: string;
    frequency: number;
    timeWindow: number;
    context?: any;
  }): void {
    const suspiciousThreshold = 10; // 10 attempts in time window
    
    if (activity.frequency > suspiciousThreshold) {
      this.securityMetrics.suspiciousAttempts++;
      
      const threat: ThreatEvent = {
        id: this.generateThreatId(),
        timestamp: Date.now(),
        type: 'suspicious_activity',
        severity: activity.frequency > 20 ? 'high' : 'medium',
        description: `Suspicious ${activity.type} activity detected`,
        metadata: {
          activityType: activity.type,
          frequency: activity.frequency,
          timeWindow: activity.timeWindow,
          context: activity.context,
          ipHash: this.getIpHash()
        },
        resolved: false
      };

      this.addThreatEvent(threat);
      this.updateSecurityScore();
      console.warn('🚨 Suspicious activity detected:', threat);
    }
  }

  // Monitor for potential key compromise
  detectKeyCompromise(indicators: {
    unusualDecryptionPatterns: boolean;
    multipleFailedAttempts: boolean;
    unexpectedKeyAge: boolean;
  }): void {
    const compromiseScore = Object.values(indicators).filter(Boolean).length;
    
    if (compromiseScore >= 2) {
      const threat: ThreatEvent = {
        id: this.generateThreatId(),
        timestamp: Date.now(),
        type: 'key_compromise',
        severity: 'critical',
        description: 'Potential encryption key compromise detected',
        metadata: {
          indicators,
          compromiseScore,
          recommendation: 'Immediate key rotation required'
        },
        resolved: false
      };

      this.addThreatEvent(threat);
      this.updateSecurityScore();
      console.error('🚨 CRITICAL: Potential key compromise detected:', threat);
      
      // Trigger emergency notifications
      this.triggerEmergencyAlert(threat);
    }
  }

  // Analyze user behavior patterns
  analyzeUserBehavior(behavior: {
    encryptionAttempts: number;
    timeSpent: number;
    errorRate: number;
    browserFingerprint: string;
  }): void {
    const anomalies: string[] = [];
    
    // Check for unusual encryption attempt frequency
    if (behavior.encryptionAttempts > 50) {
      anomalies.push('high_encryption_frequency');
    }
    
    // Check for unusual error rates
    if (behavior.errorRate > 0.3) {
      anomalies.push('high_error_rate');
    }
    
    // Check for extremely short time spent (bot-like behavior)
    if (behavior.timeSpent < 1000 && behavior.encryptionAttempts > 5) {
      anomalies.push('bot_like_behavior');
    }

    if (anomalies.length > 0) {
      const threat: ThreatEvent = {
        id: this.generateThreatId(),
        timestamp: Date.now(),
        type: 'unusual_access',
        severity: anomalies.length > 2 ? 'high' : 'medium',
        description: 'Unusual user behavior pattern detected',
        metadata: {
          anomalies,
          behavior,
          browserFingerprint: behavior.browserFingerprint.slice(0, 16)
        },
        resolved: false
      };

      this.addThreatEvent(threat);
      this.updateSecurityScore();
    }
  }

  // Get current security status
  getSecurityStatus(): {
    overallStatus: 'secure' | 'monitoring' | 'warning' | 'critical';
    activeThreats: number;
    recentThreats: ThreatEvent[];
    securityScore: number;
    recommendations: string[];
  } {
    const activeThreats = this.threatEvents.filter(t => !t.resolved).length;
    const recentThreats = this.threatEvents
      .filter(t => Date.now() - t.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    let overallStatus: 'secure' | 'monitoring' | 'warning' | 'critical' = 'secure';
    const recommendations: string[] = [];

    if (this.securityMetrics.securityScore < 50) {
      overallStatus = 'critical';
      recommendations.push('Immediate security review required');
    } else if (this.securityMetrics.securityScore < 75) {
      overallStatus = 'warning';
      recommendations.push('Enhanced monitoring recommended');
    } else if (activeThreats > 0) {
      overallStatus = 'monitoring';
    }

    if (this.securityMetrics.encryptionFailures > 10) {
      recommendations.push('Investigate encryption implementation');
    }

    if (activeThreats > 5) {
      recommendations.push('Review and resolve active threats');
    }

    return {
      overallStatus,
      activeThreats,
      recentThreats,
      securityScore: this.securityMetrics.securityScore,
      recommendations
    };
  }

  // Resolve a threat event
  resolveThreat(threatId: string, resolution: string): void {
    const threat = this.threatEvents.find(t => t.id === threatId);
    if (threat) {
      threat.resolved = true;
      threat.metadata.resolution = resolution;
      threat.metadata.resolvedAt = Date.now();
      this.persistData();
      this.updateSecurityScore();
      console.log(`✅ Threat ${threatId} resolved: ${resolution}`);
    }
  }

  // Get detailed threat analytics
  getThreatAnalytics(): {
    threatsByType: Record<string, number>;
    threatsBySeverity: Record<string, number>;
    threatsOverTime: Array<{ date: string; count: number }>;
    topThreats: ThreatEvent[];
  } {
    const threatsByType = this.threatEvents.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threatsBySeverity = this.threatEvents.reduce((acc, threat) => {
      acc[threat.severity] = (acc[threat.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Threats over last 7 days
    const threatsOverTime = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = this.threatEvents.filter(t => {
        const threatDate = new Date(t.timestamp).toISOString().split('T')[0];
        return threatDate === dateStr;
      }).length;

      return { date: dateStr, count };
    }).reverse();

    const topThreats = this.threatEvents
      .filter(t => !t.resolved)
      .sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 5);

    return {
      threatsByType,
      threatsBySeverity,
      threatsOverTime,
      topThreats
    };
  }

  // Private helper methods
  private addThreatEvent(threat: ThreatEvent): void {
    this.threatEvents.push(threat);
    this.securityMetrics.lastThreatDetected = threat.timestamp;
    
    // Keep only last 1000 threat events
    if (this.threatEvents.length > 1000) {
      this.threatEvents.shift();
    }
    
    this.persistData();
  }

  private updateSecurityScore(): void {
    const baseScore = 100;
    const encryptionPenalty = Math.min(this.securityMetrics.encryptionFailures * 2, 30);
    const suspiciousPenalty = Math.min(this.securityMetrics.suspiciousAttempts * 3, 40);
    const activeThreatsPenalty = this.threatEvents.filter(t => !t.resolved).length * 5;
    
    this.securityMetrics.securityScore = Math.max(
      baseScore - encryptionPenalty - suspiciousPenalty - activeThreatsPenalty,
      0
    );
  }

  private generateThreatId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getIpHash(): string {
    // Simple hash of connection info for privacy
    const data = `${navigator.userAgent}_${window.location.host}`;
    return btoa(data).substr(0, 12);
  }

  private triggerEmergencyAlert(threat: ThreatEvent): void {
    // Store emergency alert for admin dashboard
    const alerts = JSON.parse(localStorage.getItem('gjs_emergency_alerts') || '[]');
    alerts.push({
      ...threat,
      alertLevel: 'emergency',
      requiresImmedateAction: true
    });
    localStorage.setItem('gjs_emergency_alerts', JSON.stringify(alerts));
  }

  private startMonitoring(): void {
    // Start periodic security checks
    setInterval(() => {
      this.performSecurityCheck();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private performSecurityCheck(): void {
    // Check for unusual patterns in stored data
    const recentFailures = this.threatEvents.filter(
      t => t.type === 'encryption_failure' && 
           Date.now() - t.timestamp < 60 * 60 * 1000 // Last hour
    ).length;

    if (recentFailures > 5) {
      this.detectSuspiciousActivity({
        type: 'encryption_failures',
        frequency: recentFailures,
        timeWindow: 60 * 60 * 1000
      });
    }
  }

  private loadStoredData(): void {
    try {
      const stored = localStorage.getItem('gjs_threat_data');
      if (stored) {
        const data = JSON.parse(stored);
        this.threatEvents = data.threatEvents || [];
        this.securityMetrics = { ...this.securityMetrics, ...data.securityMetrics };
      }
    } catch (error) {
      console.warn('⚠️ Failed to load stored threat data:', error);
    }
  }

  private persistData(): void {
    try {
      const data = {
        threatEvents: this.threatEvents,
        securityMetrics: this.securityMetrics,
        lastUpdated: Date.now()
      };
      localStorage.setItem('gjs_threat_data', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Failed to persist threat data:', error);
    }
  }
}

// Export singleton instance
export const threatDetection = ThreatDetectionSystem.getInstance();

// Helper functions
export function reportEncryptionFailure(context: string, error: Error): void {
  threatDetection.reportEncryptionFailure(context, error);
}

export function detectSuspiciousActivity(activity: {
  type: string;
  frequency: number;
  timeWindow: number;
  context?: any;
}): void {
  threatDetection.detectSuspiciousActivity(activity);
}

export function getSecurityStatus() {
  return threatDetection.getSecurityStatus();
}

export function getThreatAnalytics() {
  return threatDetection.getThreatAnalytics();
}

export function resolveThreat(threatId: string, resolution: string): void {
  threatDetection.resolveThreat(threatId, resolution);
}
