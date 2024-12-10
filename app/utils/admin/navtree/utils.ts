import { Node } from "@/app/admin/components/nav_tree";

export const buildTree = (data: { id: number; name: string; path: string; order: number; }[]): Node[] => {
    const nodes: Node[] = [];                     // Array to hold all nodes
    const nodeMap: Map<string, Node> = new Map(); // Map to hold nodes by path
    const roots: Node[] = [];                     // Array to hold root nodes
    
    
    // ADD NODES TO MAP <path, node>
    data.forEach(item => {
      const node: Node = { id: item.id, name: item.name, order: item.order, children: undefined};
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

       if(pathParts.length+1 === nodePathParts.length
        && nodePath.startsWith(path)){
          const childNode = nodeMap.get(nodePath);

          if(childNode){
            const parentNode = nodeMap.get(path);
            if(parentNode){
              if(parentNode.children){
                parentNode.children.push(childNode);
              }else{
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
         { id: Date.now(), name: 'New Node', children: [], isNew: true, order: nextOrder },
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

    
