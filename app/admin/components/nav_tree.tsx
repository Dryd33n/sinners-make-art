'use client';

import { addNodeRecursively, buildTree, removeNodeRecursively, renameNodeRecursively } from '@/app/utils/admin/navtree/utils';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Node {
  link_override: string; // Link override for the node default is "auto"
  id: number;            // Unique identifier for the node
  name: string;          // Name of the node
  children?: Node[];     // List of child nodes
  isNew?: boolean;       // Flag to indicate if the node is new
  order: number;         // Order of the node
}

interface NavTreeProps {
  node: Node;                                              // Node to be displayed
  isLast?: boolean;                                        // Flag to indicate if the node is the last child
  onRename: (id: number, newName: string) => void;         // Function to rename a node
  onAddChild: (id: number) => void;                        // Function to add a child node
  onRemove: (id: number) => void;                          // Function to remove a node
  onMoveUp: (parentId: number, nodeId: number) => void;    // Function to move a node up
  onMoveDown: (parentId: number, nodeId: number) => void;  // Function to move a node down
  parentId?: number | null;                                // Id of the parent node
}

/**NAVIGATION ITEM
 * Navigation item component that displays the itself and its child nodes
 * 
 * @param param0 nav tree props
 * @returns element with navigation item and its children
 */
const NavItem: React.FC<NavTreeProps> = ({
  node,
  onRename,
  onAddChild,
  onRemove,
  onMoveUp,
  onMoveDown,
  parentId = null,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => setIsEditing(true);
  const handleSaveRename = () => {
    onRename(node.id, newName);
    setIsEditing(false);
  };

  const handleAddChild = () => onAddChild(node.id);
  const handleRemove = () => onRemove(node.id);
  const handleMoveUp = () => parentId && onMoveUp(parentId, node.id);
  const handleMoveDown = () => parentId && onMoveDown(parentId, node.id);

  return (
    <div className="flex flex-col mb-2 bg-grey-700 p-1 rounded">
      <div className="flex">
        <div className="flex items-center mb-1 bg-grey-600 rounded h-8">
          <button onClick={handleAddChild} className="mr-1">➕</button>
          <button onClick={handleMoveUp} className="mr-1">⬆️</button>
          <button onClick={handleMoveDown} className="mr-1">⬇️</button>
          <button onClick={handleRemove} className="text-red-500">✖️</button>
        </div>
        <div className="ml-2 bg-grey-700 rounded h-8 flex items-center justify-center">
          {isEditing ? (
            <>
              <input
                className="text-black align-text-middle"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                }}
                autoFocus
              />
              <button onClick={handleSaveRename}>Save</button>
            </>
          ) : (
            <span onDoubleClick={handleRename} className="text-white">
              {node.name}
            </span>
          )}
        </div>
      </div>
      <div className="ml-5">
        {node.children &&
          node.children
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <NavItem
                key={child.id}
                node={child}
                onAddChild={onAddChild}
                onRename={onRename}
                onRemove={onRemove}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                parentId={node.id}
              />
            ))}
      </div>
    </div>
  );
};

/**NAVIGATION TREE
 * Navigation tree component that displays the navigation tree and allows for modifications
 * 
 * @returns react element with navigation tree
 */
const NavTree = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [treeData, setTreeData] = useState<Node[]>([ ]);


  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setSuccessMessage("Fetching Nav Tree");
        const response = await fetch('/api/admin/navtree');
        const result = await response.json();

        if (result.success) {
          const data = result.data;

          setSuccessMessage("Building Nav Tree");


          const tree = buildTree(data);

          setTreeData(tree);
          setSuccessMessage("Nav Tree Loaded Successfully");
        } else {
          console.error('Failed to load navigation tree');
          setErrorMessage('Failed to load navigation tree');
        }
      } catch (error) {
        console.error('Error loading navigation tree:', error);
        setErrorMessage('Error loading navigation tree');
      }
    };
    
    fetchTreeData();
  }, []);


  
  /** ADD CHILD NODE
   * Adds a child node to the navigation tree using a recursive helper function.
   * 
   * @param parentId id of parent node to create a child node for
   */
  const addChild = (parentId: number) => {
    setTreeData((prevTreeData) => addNodeRecursively(prevTreeData, parentId));
  };



  /**
   * ADD MAIN CATEGORY
   * Adds a new main category to the navigation tree
   */
  const addMainCategory = () => {
    // Add a new main category to the navigation tree
    setTreeData((prevTreeData) => [
      ...prevTreeData,
      { id: Date.now(), name: 'New Main Category', children: [], isNew: true, order: prevTreeData.length, link_override: 'auto' },
    ]);
  };

  
  
  /**RENAME NODE IN NAVIGATION TREE
   * Renames a node in the tree using a recursive helper function.
   * 
   * @param nodeId id of node to be renamed
   * @param newName name to be given to the node
   */
  const renameNode = (nodeId: number, newName: string) => {
    setTreeData((prevTreeData) => renameNodeRecursively(prevTreeData, nodeId, newName));
  };



  /**REMOVE NODE FROM NAVIGATION TREE
   * Uses a recursive helper function to remove a node from the navigation
   * 
   * @param nodeId id of node to be removed
   */
  const removeNode = (nodeId: number) => {
    setTreeData((prevTreeData) => removeNodeRecursively(prevTreeData, nodeId));
  };



  /**REORDER NODE IN NAVIGATION TREE
   * moves a children node up or down in the navigation tree
   * 
   * @param parentId id of parent node
   * @param nodeId   id of node to be moved
   * @param direction up or down
   */
  const moveNode = (parentId: number | null, nodeId: number, direction: 'up' | 'down') => {
    const updateOrder = (nodes: Node[]): Node[] =>
      nodes.map((node) => {
        if (node.id === parentId && node.children) {
          const index = node.children.findIndex((child) => child.id === nodeId);
          if (index > -1) {
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex >= 0 && newIndex < node.children.length) {
              const newChildren = [...node.children];
              const [movedChild] = newChildren.splice(index, 1);
              newChildren.splice(newIndex, 0, movedChild);

              return {
                ...node,
                children: newChildren.map((child, idx) => ({ ...child, order: idx })),
              };
            }
          }
        }
        return { ...node, children: updateOrder(node.children || []) };
      });



    
    setTreeData((prevTreeData) => {
      if (parentId === null) {
        const index = prevTreeData.findIndex((node) => node.id === nodeId);
        if (index > -1) {
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex >= 0 && newIndex < prevTreeData.length) {
            const newTreeData = [...prevTreeData];
            const [movedNode] = newTreeData.splice(index, 1);
            newTreeData.splice(newIndex, 0, movedNode);
            return newTreeData.map((node, idx) => ({ ...node, order: idx }));
          }
        }
      } else {
        return updateOrder(prevTreeData);
      }
      return prevTreeData;
    });
  };



  /**POST NAVIGATION TREE
   * sends the navigation tree to the server
   * 
   * @param nodes nodes of nav tree to be posted
   */
  const postNavTree = async (nodes: Node[]) => {
    setSuccessMessage("Converting Nav Tree");

    interface FlattenedNode {
      id: number;
      name: string;
      path: string;
      order: number;
    }

    const flattenTree = (nodes: Node[], parentPath: string = ''): FlattenedNode[] => {
      return nodes.reduce((acc, node) => {
        const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
        acc.push({ id: node.id, name: node.name, path: currentPath, order: node.order });
  
        if (node.children) {
          acc = acc.concat(flattenTree(node.children, currentPath));
        }
  
        return acc;
      }, [] as FlattenedNode[]);
    };
  
    const flattenedTree = flattenTree(nodes);
  
    try {
      setSuccessMessage("Sending Nav Tree");
      const response = await fetch('/api/admin/navtree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treeData: flattenedTree }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Navigation tree successfully saved:', result);
        setSuccessMessage('Navigation tree successfully saved');
      } else {
        console.error('Failed to save navigation tree:', response.statusText);
        setErrorMessage('Failed to save navigation tree');
      }
    } catch (error) {
      console.error('Error posting navigation tree:', error);
      setErrorMessage('Error posting navigation tree');
    }
  };

  const onMoveUp = (parentId: number, nodeId: number) => moveNode(parentId, nodeId, 'up');
  const onMoveDown = (parentId: number, nodeId: number) => moveNode(parentId, nodeId, 'down');
  

  return (
    <div className="bg-grey-850 rounded-lg p-5">
      <h1 className="text-xl font-bold m-3">Navigation Schema</h1>
      <div className="bg-grey-800 p-3 rounded-md m-5 flex space-x-4">
        {treeData.map((node) => (
          <NavItem
            key={node.id}
            node={node}
            onAddChild={addChild}
            onRename={renameNode}
            onRemove={removeNode}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        ))}
      </div>
      <button onClick={addMainCategory} className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded-md">
        Add Main Category
      </button>
      <button onClick={() => postNavTree(treeData)} className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded-md ml-2">
        Update Navigation Tree
      </button>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default NavTree;
