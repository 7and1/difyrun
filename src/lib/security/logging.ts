// Security Event Logging System
// Logs security-relevant events for monitoring and incident response

interface SecurityEvent {
  timestamp: string;
  eventType:
    | "auth_failure"
    | "rate_limit"
    | "csrf_attempt"
    | "suspicious_activity"
    | "error";
  severity: "low" | "medium" | "high" | "critical";
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  details?: Record<string, any>;
}

/**
 * Log a security event
 * In production, this should integrate with:
 * - Cloudflare Workers Analytics
 * - D1 database security_logs table
 * - External SIEM/logging service
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  // Always log to console for Cloudflare Workers logs
  const logEntry = {
    level: "SECURITY",
    ...event,
  };

  if (event.severity === "critical" || event.severity === "high") {
    console.error("[SECURITY]", JSON.stringify(logEntry));
  } else {
    console.warn("[SECURITY]", JSON.stringify(logEntry));
  }

  // TODO: Store in D1 database when security_logs table is created
  // const db = getDB();
  // await db.prepare(`
  //   INSERT INTO security_logs (timestamp, event_type, severity, ip, endpoint, details)
  //   VALUES (?, ?, ?, ?, ?, ?)
  // `).bind(
  //   event.timestamp,
  //   event.eventType,
  //   event.severity,
  //   event.ip || null,
  //   event.endpoint || null,
  //   JSON.stringify(event.details || {})
  // ).run();
}

/**
 * Create a security event from a request
 */
export function createSecurityEvent(
  request: Request,
  eventType: SecurityEvent["eventType"],
  severity: SecurityEvent["severity"],
  details?: Record<string, any>,
): SecurityEvent {
  const url = new URL(request.url);

  return {
    timestamp: new Date().toISOString(),
    eventType,
    severity,
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown",
    userAgent: request.headers.get("user-agent") || undefined,
    endpoint: url.pathname,
    details,
  };
}
