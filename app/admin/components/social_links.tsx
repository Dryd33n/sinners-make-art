'use client'

import React, { useEffect, useState } from 'react';
import { SocialLink } from '@/db/schema';


const SocialLinks: React.FC = () => {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [newLink, setNewLink] = useState<SocialLink>({ name: '', url: '' });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
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


    const handleAddLink = () => {
        setLinks([...links, newLink]);
        setNewLink({ name: '', url: '' });
    };

    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
    };

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