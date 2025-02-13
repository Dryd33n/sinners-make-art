import Tooltip from "@/app/admin/components/shared/tooltip";
import { useEffect, useState } from "react";

interface PathSelectorProps {
    onSelect: (selectedPath: PathItem) => void;
    selectedPath: PathItem;
    excludeOverriden: boolean;
    selectedPathMsg: string;
};

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
};

/**
 * PathSelector component allows users to select a path from a list of available paths.
 * It fetches paths from the server and displays them in a scrollable list.
 * Users can select a path, which triggers the onSelect callback with the selected path.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {function(PathItem): void} props.onSelect - Callback function to handle path selection
 * @param {boolean} props.excludeOverriden - Flag to exclude paths with link overrides
 * @param {string} props.selectedPathMsg - Message to display for the selected path
 * 
 * @example
 * return <PathSelector onSelect={handlePathSelect} excludeOverriden={true} selectedPathMsg="Selected Path" />
 */
export default function PathSelector({ onSelect, excludeOverriden, selectedPathMsg, selectedPath }: PathSelectorProps) {
    const [allPaths, setAllPaths] = useState<PathItem[]>([]); // All available paths
    const [selectedTag, setSelectedTag] = useState<PathItem>();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const response = await fetch('/api/admin/navtree/overrides');
                const result = await response.json();
    
                if (result.success) {
                    const paths = (excludeOverriden ? result.data.filter((item: PathItem) => item.linkOverride == 'auto') : result.data);
                    //sort paths lexigraphically by path property
                    const sortedPaths = paths.sort((a: PathItem, b: PathItem) => a.path.localeCompare(b.path));
                    setAllPaths(sortedPaths);   
                    setErrorMessage('');
                    setSuccessMessage('Tags successfully loaded');
                } else {
                    console.error('Failed to fetch tags');
                    setErrorMessage('Failed to fetch tags');
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
                setErrorMessage('Error fetching tags');
            }
        };
    

        fetchPaths();
    }, [excludeOverriden]);

    useEffect(() => {
        if(selectedPath.id === -10){
            const path = allPaths.find((path) => path.path === selectedPath.path);
            setSelectedTag(path);
        }else if (selectedPath.id !== -1) {
            setSelectedTag(selectedPath);
        }
    }, [selectedPath, allPaths]);

    /** Change local selected tag for styling and execute call back method onSelect
     * 
     * @param path pathItem to change tag to,
     */
    const handleSelect = (path: PathItem) => {
        setSelectedTag(path);
        onSelect(path);
    };

    return (<><div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium mb-4">
            Post Category:
        </label>
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
        <div className="flex content-center">
            {excludeOverriden && (<Tooltip>
                <p>Tags / Categories with a link overide set cannot be selected</p>
            </Tooltip>)}
            <h2 className="font-semibold mb-2 mt-[2]">Available Paths</h2>
        </div>
        <div className="h-64 overflow-y-auto bg-grey-700 rounded-md p-2">
            {allPaths.map((path) => (
                <div
                    key={path.id}
                    className="flex justify-between items-center p-2 hover:bg-grey-600 cursor-pointer"
                    onClick={() => handleSelect(path)}
                >
                    <span className="text-white">{path.path}</span>
                </div>
            ))}
        </div>
        <h2 className="font-semibold mt-3 mb-2">{selectedPathMsg}</h2>
        <p className="bg-grey-700 rounded-md p-2">
            {selectedTag?.path}
        </p>
        
    </div></>)
};