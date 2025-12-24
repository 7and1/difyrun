"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface CustomNodeData {
  label: string;
  type: string;
  color: string;
  description?: string;
}

export const CustomNode = memo(
  ({ data, selected }: NodeProps<CustomNodeData>) => {
    return (
      <div
        className={`
        px-4 py-3 rounded-lg shadow-md min-w-[150px] max-w-[220px]
        transition-all duration-200
        ${selected ? "ring-2 ring-white ring-offset-2 ring-offset-background" : ""}
      `}
        style={{ backgroundColor: data.color }}
      >
        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-white !border-2"
          style={{ borderColor: data.color }}
        />

        {/* Content */}
        <div className="text-white">
          <div className="text-xs uppercase tracking-wider opacity-75 mb-1 font-medium">
            {data.type.replace(/-/g, " ")}
          </div>
          <div className="font-semibold text-sm leading-tight truncate">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs opacity-75 mt-1 line-clamp-2">
              {data.description}
            </div>
          )}
        </div>

        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-white !border-2"
          style={{ borderColor: data.color }}
        />
      </div>
    );
  },
);

CustomNode.displayName = "CustomNode";
