"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Node,
} from "reactflow";
import { AlertCircle, Expand, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomNode } from "./CustomNode";
import { parseDslToFlow } from "@/lib/visualizer/dsl-to-flow";
import { autoLayout } from "@/lib/visualizer/auto-layout";

import "reactflow/dist/style.css";

interface DslVisualizerProps {
  dslContent: string;
  className?: string;
}

const nodeTypes = {
  custom: CustomNode,
};

export function DslVisualizer({ dslContent, className }: DslVisualizerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Parse DSL and prepare flow data
  const flowData = useMemo(() => {
    try {
      const { nodes, edges, hasPositions } = parseDslToFlow(dslContent);

      if (nodes.length === 0) {
        return { nodes: [], edges: [], error: null };
      }

      // Apply auto-layout if needed
      const layoutedNodes = hasPositions ? nodes : autoLayout(nodes, edges);

      return { nodes: layoutedNodes, edges, error: null };
    } catch (error) {
      return {
        nodes: [],
        edges: [],
        error:
          error instanceof Error ? error.message : "Failed to parse workflow",
      };
    }
  }, [dslContent]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log("Node clicked:", node);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Show error state
  if (flowData.error) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border bg-muted/50 p-8 ${className}`}
      >
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">Unable to Visualize</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {flowData.error}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (nodes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border bg-muted/50 p-8 ${className}`}
      >
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg mb-2">No Nodes Found</h3>
          <p className="text-sm text-muted-foreground">
            This workflow doesn&apos;t contain any visualizable nodes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg border overflow-hidden ${
        isFullscreen ? "fixed inset-4 z-50 bg-background shadow-2xl" : className
      }`}
    >
      {/* Fullscreen toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8 shadow"
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="!bg-background !border !shadow" />
        <MiniMap
          nodeColor={(node) => node.data?.color || "#94a3b8"}
          className="!bg-background !border"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground) / 0.2)"
        />
      </ReactFlow>

      {/* Node count badge */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur text-xs px-2 py-1 rounded border shadow">
          {nodes.length} nodes • {edges.length} connections
        </div>
      </div>
    </div>
  );
}
