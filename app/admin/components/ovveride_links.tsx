'use client';

import Tooltip from '@/app/components/global/tooltip';
import React, { useEffect, useState } from 'react';

interface OverrideItem {
  id: number;
  path: string;
  linkOverride: string;
}

const LinkOverrideManager: React.FC = () => {
  const [allPaths, setAllPaths] = useState<OverrideItem[]>([]); // All available paths
  const [overrides, setOverrides] = useState<OverrideItem[]>([]); // Current overrides
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
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

  const addOverride = (id: number) => {
    const selectedPath = allPaths.find((path) => path.id === id);
    if (selectedPath && !overrides.some((item) => item.id === id)) {
      setOverrides([...overrides, { ...selectedPath, linkOverride: '' }]);
    }
  };

  const removeOverride = (id: number) => {
    setOverrides(overrides.filter((item) => item.id !== id));
  };

  const updateOverride = (id: number, newLink: string) => {
    setOverrides(
      overrides.map((item) =>
        item.id === id ? { ...item, linkOverride: newLink } : item
      )
    );
  };

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
        <div className="w-1/2 bg-grey-800 p-3 rounded-md">
          <h2 className="font-semibold mb-2">Available Paths</h2>
          <div className="h-64 overflow-y-auto bg-grey-700 rounded-md p-2">
            {allPaths.map((path) => (
              <div
                key={path.id}
                className="flex justify-between items-center p-2 hover:bg-grey-600 cursor-pointer"
                onClick={() => addOverride(path.id)}
              >
                <span className="text-white">{path.path}</span>
              </div>
            ))}
          </div>
        </div>

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
