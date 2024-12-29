import { Node } from "@/app/admin/components/nav_tree";

interface FlattenedNode {
  id: number;
  name: string;
  path: string;
  order: number;
}

export const buildTree = (data: { id: number; name: string; path: string; order: number; link_ovveride: string; }[]): Node[] => {
  const nodeMap: Map<string, Node> = new Map(); // Map to hold nodes by path
  const roots: Node[] = [];                     // Array to hold root nodes


  // ADD NODES TO MAP <path, node>
  data.forEach(item => {
    const node: Node = {
      id: item.id, name: item.name, order: item.order, children: undefined, link_override: item.link_ovveride
    };
    nodeMap.set(item.path, node);
  });

  /**ADD CHILDREN NODES
   * 
   * Finds all valid children in the node map and adds them to the parent nodes
   * then recursively calls itself to add children to the children nodes
   * 
   * @param nodeMap node map containing nodes and paths
   * @param path path to node to add children to
   * @returns None
   */
  const addChildrenNodes = (nodeMap: Map<string, Node>, path: string) => {
    const pathParts = path.split('/');

    nodeMap.forEach((node, nodePath) => {
      const nodePathParts = nodePath.split('/');

      if (pathParts.length + 1 === nodePathParts.length
        && nodePath.startsWith(path)) {
        const childNode = nodeMap.get(nodePath);

        if (childNode) {
          const parentNode = nodeMap.get(path);
          if (parentNode) {
            if (parentNode.children) {
              parentNode.children.push(childNode);
            } else {
              parentNode.children = [childNode];
            }
          }
        }

        addChildrenNodes(nodeMap, nodePath)
      }
    });

    return undefined
  };


  nodeMap.forEach((node, path) => {
    const pathParts = path.split('/');

    if (pathParts.length === 1) {
      roots.push(node);
      addChildrenNodes(nodeMap, path);
    }
  });

  // Sort children arrays by the "order" property
  const sortNodes = (nodes: Node[]) => nodes.sort((a, b) => a.order - b.order);
  const sortTree = (nodes: Node[]) => {
    nodes.forEach(node => {
      if (node.children) {
        sortTree(node.children);
        sortNodes(node.children);
      }
    });
  };

  sortTree(roots);
  return sortNodes(roots);
};



/** ADD NODE RECURSIVELY
* 
* Recursively searches each main category's tree for the parent node to add a child to
* when found the child node is added
* 
* @param nodes list of nodes to be searched
* @returns list of nodes with the added child node
*/
export const addNodeRecursively = (nodes: Node[], parentId: number): Node[] =>
  nodes.map((node) => {
    if (node.id === parentId) {
      const nextOrder = (node.children?.length || 0);
      return {
        ...node,
        children: [
          ...(node.children || []),
          { id: Date.now(), name: 'New Node', children: [], isNew: true, order: nextOrder, link_override: "auto" },
        ],
      };
    }
    return { ...node, children: addNodeRecursively(node.children || [], parentId) };
  });



/** RENAME NODE RECURSIVELY
 * 
 * Recursively searches each main category's tree for the node to be renamed
 * when found the node is renamed
 * 
 * @param nodes list of nodes to be searched
 * @returns list of nodes with the renamed node
 */
export const renameNodeRecursively = (nodes: Node[], nodeId: number, newName: string): Node[] =>
  nodes.map((node) => {
    // Node Found -> Rename Node
    if (node.id === nodeId) {
      return { ...node, name: newName, isNew: false };
    }
    // Node Not Found -> Recursively Search Children
    return { ...node, children: renameNodeRecursively(node.children || [], nodeId, newName) };
  });


/**REMOVE NODE RECURSIVELY
 * 
 * Recursively searches each main category's tree for the node to be removed
 * when found the node is removed
 * 
 * @param nodes list of nodes to be searched
 * @returns list of nodes with the removed
 */
export const removeNodeRecursively = (nodes: Node[], nodeId: number): Node[] =>
  nodes.filter((node) => node.id !== nodeId).map((node) => ({
    ...node,
    children: removeNodeRecursively(node.children || [], nodeId),
  }));



/**
 * Converts a path into the proper destination link format.
 * @param path - The input path string.
 * @returns The formatted destination link.
 */
export function convertToDestinationLink(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error("Path must start with '/'");
  }

  const segments = path.split('/').filter(Boolean); // Split and filter out empty segments
  if (segments.length === 0) {
    throw new Error("Path must have at least one segment after '/'");
  } else if (segments.length === 1) {
    return path;
  }

  const base = segments[0]; // First segment becomes the base
  const remainingPath = segments.join('/').replace(/[\s/]+/g, "-"); // Join the segments for the hash

  return `/${base}#${remainingPath}`;
}


/**Converts nested node tree structure to a simple array containing all link items for the navigation tree
 * 
 * @param nodes Array of root nodes to flatten
 * @param parentPath path to begin flattening
 * @returns a one dimensional array of link item
 */
export const flattenTree = (nodes: Node[], parentPath: string = ''): FlattenedNode[] => {

  return nodes.reduce((acc, node) => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    acc.push({ id: node.id, name: node.name, path: currentPath, order: node.order });

    if (node.children) {
      acc = acc.concat(flattenTree(node.children, currentPath));
    }

    return acc;
  }, [] as FlattenedNode[]);
};



