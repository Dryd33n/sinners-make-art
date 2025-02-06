'use client';

import Tooltip from '@/app/admin/components/shared/tooltip';
import React, { useEffect, useState } from 'react';
import PathSelector from './shared/path_selector';

interface OverrideItem {
  id: number;
  path: string;
  linkOverride: string;
}

/**
 * LinkOverrideManager component manages the overrides for navigation links.
 * It fetches available paths and allows the user to add, remove, and update overrides.
 * The overrides can be saved to the server.
 *
 * @component
 * @example
 * return (
 *   <LinkOverrideManager />
 * )
 *
 * @returns {React.FC} The LinkOverrideManager component.
 */
const LinkOverrideManager: React.FC = () => {
  const [allPaths, setAllPaths] = useState<OverrideItem[]>([]); // All available paths
  const [overrides, setOverrides] = useState<OverrideItem[]>([]); // Current overrides
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    /**
     * Fetches the navigation tree overrides from the server.
     * 
     * This function sends a request to the `/api/admin/navtree/overrides` endpoint
     * to retrieve the navigation tree overrides. If the request is successful and
     * the response indicates success, it sets the retrieved paths and overrides
     * in the state. Overrides with `linkOverride` not set to "auto" are
     * automatically added to the overrides state. It also sets appropriate success
     * and error messages based on the result.
     * 
     * @async
     * @function fetchPaths
     * @returns {Promise<void>} A promise that resolves when the fetch operation is complete.
     * @throws Will throw an error if the fetch operation fails.
     */
    const fetchPaths = async () => {
      try {
        const response = await fetch('/api/admin/navtree/overrides');
        const result = await response.json();

        if (result.success) {
          setAllPaths(result.data);

          // Automatically add overrides with linkOverride not set to "auto"
          const initialOverrides = result.data.filter(
            (item: OverrideItem) => item.linkOverride !== 'auto'
          );
          setOverrides(initialOverrides);

          setErrorMessage('');
          setSuccessMessage('Overrides successfully loaded');
        } else {
          console.error('Failed to fetch paths');
          setErrorMessage('Failed to fetch paths');
        }
      } catch (error) {
        console.error('Error fetching paths:', error);
        setErrorMessage('Error fetching paths');
      }
    };

    fetchPaths();
  }, []);



  /**
   * Adds a selected path to the overrides list if it is not already present.
   *
   * @param {number} id - The ID of the path to be added to the overrides list.
   */
  const addOverride = (id: number) => {
    const selectedPath = allPaths.find((path) => path.id === id);
    if (selectedPath && !overrides.some((item) => item.id === id)) {
      setOverrides([...overrides, { ...selectedPath, linkOverride: '' }]);
    }
  };



  /**
   * Removes an override from the list of overrides based on the provided ID.
   *
   * @param {number} id - The ID of the override to be removed.
   */
  const removeOverride = (id: number) => {
    setOverrides(overrides.filter((item) => item.id !== id));
  };



  /**
   * Updates the override link for a specific item in the overrides list.
   *
   * @param {number} id - The ID of the item to update.
   * @param {string} newLink - The new link to override the existing one.
   */
  const updateOverride = (id: number, newLink: string) => {
    setOverrides(
      overrides.map((item) =>
        item.id === id ? { ...item, linkOverride: newLink } : item
      )
    );
  };



  /**
   * Saves the current overrides by sending a POST request to the server.
   * This function sends a POST request to the `/api/admin/navtree/overrides` endpoint with the current overrides
   * in the request body. If the request is successful, it sets a success message. If the request fails, it sets
   * an error message and logs the error to the console.
   * 
   * @async
   * @function saveOverrides
   * @returns {Promise<void>} A promise that resolves when the overrides are successfully saved.
   * 
   * @throws Will throw an error if the request fails.
   */
  const saveOverrides = async () => {
    try {
      const response = await fetch('/api/admin/navtree/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides }),
      });

      if (response.ok) {
        setSuccessMessage('Overrides successfully saved');
      } else {
        console.error('Failed to save overrides:', response.statusText);
        setErrorMessage('Failed to save overrides');
      }
    } catch (error) {
      console.error('Error saving overrides:', error);
      setErrorMessage('Error saving overrides');
    }
  };

  return (
    <div className="bg-grey-850 rounded-lg p-5">
      <h1 className="text-xl font-bold mb-4">Link Override Manager</h1>

      <div className="flex space-x-6">
        {/* Scrollable dropdown for available paths */}
        <PathSelector excludeOverriden={false} selectedPathMsg='Setting Destination Override on:' selectedPath={{id: -1, path: "", linkOverride: ""}} onSelect={(path) => addOverride(path.id)}/>

        {/* List of overrides */}
        <div className="w-1/2 bg-grey-800 p-3 rounded-md">
          <div className='flex'>
            <Tooltip>
              <p>
                Here you type the path in the file structure which points to the desired destination.
                use the format /path/to/destination to override the default behavior. The path must
                lead to a valid page in the application routing file structure.
              </p>
            </Tooltip>
            <h2 className="font-semibold mb-2">Overrides</h2>
          </div>
          <div className="space-y-3">
            {overrides.map((override) => (
              <div
                key={override.id}
                className="bg-grey-700 p-2 rounded-md flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-white text-sm mb-1">{override.path}</p>
                  <input
                    type="text"
                    className="w-full p-1 text-black rounded-md"
                    placeholder="Custom Path"
                    value={override.linkOverride}
                    onChange={(e) => updateOverride(override.id, e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeOverride(override.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={saveOverrides}
          className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded-md"
        >
          Save Overrides
        </button>
      </div>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default LinkOverrideManager;
