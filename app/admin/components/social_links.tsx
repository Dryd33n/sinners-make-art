'use client'

import React, { useEffect, useState } from 'react';
import { SocialLink } from '@/db/schema';


/**
 * SocialLinks component allows users to add, view, and remove social media links.
 * It fetches existing links from the server on mount and provides functionality to save the updated list of links.
 *
 * @component
 * @example
 * return (
 *   <SocialLinks />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */
const SocialLinks: React.FC = (): JSX.Element => {
    // State to store the list of social media links
    const [links, setLinks] = useState<SocialLink[]>([]);
    // State to store the new link being added
    const [newLink, setNewLink] = useState<SocialLink>({ name: '', url: '' });
    // State to store success message
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    
    useEffect(() => {
        /**
         * Fetches social links from the API and updates the state with the fetched links.
         * 
         * This function performs the following steps:
         * 1. Clears any existing success or error messages.
         * 2. Sends a GET request to the '/api/social_links' endpoint.
         * 3. Parses the JSON response.
         * 4. If the response indicates success, updates the success message and sets the fetched links.
         * 5. If the response indicates failure, updates the error message and logs the error.
         * 6. Catches any network or parsing errors, updates the error message, and logs the error.
         * 
         * @async
         * @function fetchLinks
         * @returns {Promise<void>} A promise that resolves when the fetch operation is complete.
         */
        const fetchLinks = async (): Promise<void> => {
            setSuccessMessage('');
            setErrorMessage('');

            try {
                const response = await fetch('/api/social_links');
                const data = await response.json();
                if (data.success) {
                    setSuccessMessage("Links fetched successfully");
                    setErrorMessage('');
                    setLinks(data.data); // Set the fetched links
                } else {
                    setSuccessMessage('');
                    setErrorMessage('Error fetching links');
                    console.error('Error fetching links:', data.error);
                }
            } catch (error) {
                setSuccessMessage('');
                setErrorMessage('Error fetching links');
                console.error('Error fetching links:', error);
            }
        };

        fetchLinks();
    }, []);



    /**
     * Asynchronously saves the social links by first deleting all existing links and then adding the new ones.
     * 
     * @async
     * @function saveLinks
     * @returns {Promise<void>} A promise that resolves when the links have been saved.
     * 
     * @throws Will set an error message if there is an issue with saving the links.
     */
    const saveLinks = async () => {
        try {
            // Delete all existing links first
            for (const link of links) {
                if (link.id) {
                    await fetch('/api/social_links', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: link.id }),
                    });
                }
            }

            // Add all new links
            for (const link of links) {
                await fetch('/api/social_links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: link.name, url: link.url }),
                });
            }

            setErrorMessage('');
            setSuccessMessage('Links saved successfully');
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage('Error saving links');
            console.log('Error saving links:', error);
        }
    };



    /**
     * Adds a new social link to the list of links and resets the new link input fields.
     *
     * @remarks
     * This function updates the state by appending the new link to the existing list of links.
     * After adding the new link, it resets the `newLink` state to an empty object with default values.
     */
    const handleAddLink = () => {
        setLinks([...links, newLink]);
        setNewLink({ name: '', url: '' });
    };



    /**
     * Handles the removal of a social link from the list.
     *
     * @param index - The index of the link to be removed.
     */
    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
    };

    

    /**
     * Handles the change event for input elements.
     * Updates the state with the new value for the input field.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by the input element.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewLink({ ...newLink, [name]: value });
    };

    return (
        <div>
            <h2>Add Social Media Links:</h2>
            <div className='mb-5'>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newLink.name}
                    onChange={handleChange}
                    className='p-2 border border-gray-300 rounded text-black m-1'
                />
                <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={newLink.url}
                    onChange={handleChange}
                    className='p-2 border border-gray-300 rounded text-black m-1'
                />
                <button onClick={handleAddLink} className='p-2 bg-blue-500 font-light text-white rounded hover:bg-blue-600 disabled:opacity-20'>Add</button>
            </div>
            <h2>Current Social Media Links:</h2>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <div className='flex flex-row gap-2 mb-2'>
                            <p className='bg-grey-700 p-2 rounded-md w-24'>{link.name}</p>
                            <p className='bg-grey-700 p-2 rounded-md '>{link.url}</p>
                            <button onClick={() => handleRemoveLink(index)}
                                className='p-2 ml-auto mr-20 bg-red-500 font-light text-white rounded hover:bg-red-600 disabled:opacity-20'
                            >Remove</button>
                        </div>

                    </li>
                ))}
            </ul>
            {successMessage && <p className='text-green-500'>{successMessage}</p>}
            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
            <button onClick={saveLinks} className='mb-4 mr-4 mt-5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>Save</button>
            
        </div>
    );
};

export default SocialLinks;