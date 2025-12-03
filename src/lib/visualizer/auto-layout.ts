// Auto-layout algorithm using Dagre

import dagre from '@dagrejs/dagre';
import { Node, Edge } from 'reactflow';

interface LayoutOptions {
  direction: 'TB' | 'LR' | 'BT' | 'RL';
  nodeWidth: number;
  nodeHeight: number;
  nodeSep: number;
  rankSep: number;
}

const DEFAULT_OPTIONS: LayoutOptions = {
  direction: 'LR', // Left to right
  nodeWidth: 200,
  nodeHeight: 80,
  nodeSep: 50,
  rankSep: 100,
};

export function autoLayout(
  nodes: Node[],
  edges: Edge[],
  options: Partial<LayoutOptions> = {}
): Node[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if layout is needed
  const needsLayout = nodes.every(node =>
    !node.position ||
    (node.position.x === 0 && node.position.y === 0)
  );

  if (!needsLayout && nodes.length > 0) {
    return nodes;
  }

  // Create Dagre graph
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: opts.direction,
    nodesep: opts.nodeSep,
    ranksep: opts.rankSep,
    marginx: 20,
    marginy: 20,
  });

  // Add nodes
  nodes.forEach((node) => {
    g.setNode(node.id, {
      width: opts.nodeWidth,
      height: opts.nodeHeight,
    });
  });

  // Add edges
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run layout algorithm
  dagre.layout(g);

  // Apply calculated positions
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    if (!nodeWithPosition) {
      return node;
    }

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - opts.nodeWidth / 2,
        y: nodeWithPosition.y - opts.nodeHeight / 2,
      },
    };
  });
}
