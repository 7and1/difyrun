"use client";

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CompatibilityBadgeProps {
  difyVersion: string | null;
  worksCount: number;
  brokenCount: number;
  className?: string;
}

// Current stable Dify version (update when new versions release)
const CURRENT_DIFY_VERSION = "1.6";
const MINIMUM_SUPPORTED_VERSION = "0.6";

function parseVersion(version: string | null): number[] {
  if (!version) return [0, 0, 0];
  const parts = version.replace(/^v/, "").split(".");
  return parts.map((p) => parseInt(p, 10) || 0);
}

function compareVersions(v1: number[], v2: number[]): number {
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const a = v1[i] || 0;
    const b = v2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

type CompatibilityStatus = "verified" | "compatible" | "outdated" | "unknown";

function getCompatibilityStatus(
  difyVersion: string | null,
  worksCount: number,
  brokenCount: number,
): { status: CompatibilityStatus; message: string } {
  const version = parseVersion(difyVersion);
  const currentVersion = parseVersion(CURRENT_DIFY_VERSION);
  const minVersion = parseVersion(MINIMUM_SUPPORTED_VERSION);

  const totalVotes = worksCount + brokenCount;
  const worksRatio = totalVotes > 0 ? worksCount / totalVotes : 0;

  // Community verified (>= 5 votes, >= 80% works)
  if (totalVotes >= 5 && worksRatio >= 0.8) {
    return {
      status: "verified",
      message: `Community verified (${Math.round(worksRatio * 100)}% success rate)`,
    };
  }

  // Version-based checks
  if (!difyVersion) {
    return {
      status: "unknown",
      message: "Version unknown - may require testing",
    };
  }

  // Outdated version (below minimum)
  if (compareVersions(version, minVersion) < 0) {
    return {
      status: "outdated",
      message: `Created for Dify v${difyVersion} - may not work with current versions`,
    };
  }

  // Compatible (within supported range)
  if (compareVersions(version, currentVersion) <= 0) {
    return {
      status: "compatible",
      message: `Compatible with Dify v${difyVersion}+`,
    };
  }

  // Future version (somehow)
  return {
    status: "compatible",
    message: `Designed for Dify v${difyVersion}`,
  };
}

export function CompatibilityBadge({
  difyVersion,
  worksCount,
  brokenCount,
  className,
}: CompatibilityBadgeProps) {
  const { status, message } = getCompatibilityStatus(
    difyVersion,
    worksCount,
    brokenCount,
  );

  const statusConfig = {
    verified: {
      icon: CheckCircle,
      variant: "default" as const,
      className:
        "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    },
    compatible: {
      icon: CheckCircle,
      variant: "outline" as const,
      className: "border-green-300 text-green-700",
    },
    outdated: {
      icon: AlertTriangle,
      variant: "outline" as const,
      className: "border-amber-300 text-amber-700 bg-amber-50",
    },
    unknown: {
      icon: Info,
      variant: "outline" as const,
      className: "border-gray-300 text-gray-600",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn("gap-1 font-normal", config.className, className)}
      title={message}
    >
      <Icon className="h-3 w-3" />
      <span className="hidden sm:inline">{message}</span>
      <span className="sm:hidden">
        {status === "verified" && "Verified"}
        {status === "compatible" && `v${difyVersion}`}
        {status === "outdated" && "Outdated"}
        {status === "unknown" && "Unknown"}
      </span>
    </Badge>
  );
}

// Compact version for workflow cards
export function CompatibilityIndicator({
  difyVersion,
  worksCount,
  brokenCount,
  className,
}: CompatibilityBadgeProps) {
  const { status } = getCompatibilityStatus(
    difyVersion,
    worksCount,
    brokenCount,
  );

  const statusConfig = {
    verified: { color: "text-green-500", title: "Community verified" },
    compatible: { color: "text-green-400", title: "Compatible" },
    outdated: { color: "text-amber-500", title: "May be outdated" },
    unknown: { color: "text-gray-400", title: "Version unknown" },
  };

  const config = statusConfig[status];

  if (status === "verified") {
    return (
      <span title={config.title}>
        <CheckCircle className={cn("h-4 w-4", config.color, className)} />
      </span>
    );
  }

  if (status === "outdated") {
    return (
      <span title={config.title}>
        <AlertTriangle className={cn("h-4 w-4", config.color, className)} />
      </span>
    );
  }

  return null;
}
