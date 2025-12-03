// Convert Dify DSL to ReactFlow format

import { Node, Edge, MarkerType } from 'reactflow';
import yaml from 'js-yaml';

interface FlowData {
  nodes: Node[];
  edges: Edge[];
  hasPositions: boolean;
}

// Node type colors
const NODE_COLORS: Record<string, string> = {
  start: '#22c55e',          // Green
  end: '#ef4444',            // Red
  llm: '#3b82f6',            // Blue
  'knowledge-retrieval': '#8b5cf6', // Purple
  retrieval: '#8b5cf6',      // Purple
  code: '#f97316',           // Orange
  'http-request': '#06b6d4', // Cyan
  'if-else': '#eab308',      // Yellow
  'variable-assigner': '#64748b', // Slate
  'variable-aggregator': '#64748b', // Slate
  tool: '#ec4899',           // Pink
  iteration: '#14b8a6',      // Teal
  'iteration-start': '#14b8a6', // Teal
  'parameter-extractor': '#8b5cf6', // Purple
  'question-classifier': '#f97316', // Orange
  'template-transform': '#6366f1', // Indigo
  answer: '#22c55e',         // Green
  default: '#94a3b8',        // Gray
};

// Parse DSL content string to flow data
export function parseDslToFlow(dslContent: string): FlowData {
  try {
    // Parse YAML
    const dsl = yaml.load(dslContent) as any;

    if (!dsl || !dsl.workflow?.nodes) {
      return { nodes: [], edges: [], hasPositions: true };
    }

    const dslNodes = dsl.workflow.nodes || [];
    const dslEdges = dsl.workflow.edges || [];

    // Convert nodes
    const nodes: Node[] = dslNodes.map((node: any) => {
      const type = node.data?.type || 'default';
      const color = NODE_COLORS[type] || NODE_COLORS.default;

      return {
        id: node.id,
        type: 'custom',
        data: {
          label: node.data?.title || node.id,
          type: type,
          color: color,
          description: node.data?.desc,
        },
        position: node.position || { x: 0, y: 0 },
      };
    });

    // Convert edges
    const edges: Edge[] = dslEdges.map((edge: any, index: number) => ({
      id: `e-${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'smoothstep',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
      },
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
      },
    }));

    // Check if positions are valid
    const hasPositions = dslNodes.some(
      (node: any) => node.position && (node.position.x !== 0 || node.position.y !== 0)
    );

    return { nodes, edges, hasPositions };
  } catch (error) {
    console.error('Failed to parse DSL:', error);
    return { nodes: [], edges: [], hasPositions: true };
  }
}

// Get node color by type
export function getNodeColor(type: string): string {
  return NODE_COLORS[type] || NODE_COLORS.default;
}

// Get all unique node types from DSL
export function getNodeTypes(dslContent: string): string[] {
  try {
    const dsl = yaml.load(dslContent) as any;
    if (!dsl?.workflow?.nodes) return [];

    const types = new Set<string>();
    for (const node of dsl.workflow.nodes) {
      if (node.data?.type) {
        types.add(node.data.type);
      }
    }
    return Array.from(types);
  } catch {
    return [];
  }
}
