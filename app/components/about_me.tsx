"use client"

import React, { useEffect, useState } from 'react';

export default function AboutMe() {
    const [aboutData, setAboutData] = useState({ about_title: '', about_text: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        /*  ASYNC FUNCTION TO FETCH DATA FROM THE SERVER  */
        const fetchData = async () => {
            try {
                /*  CALLS GET METHOD FORM app/api/about_me/route.ts    */
                const response = await fetch('/api/about_me');

                /* CHECKS IF RESPONSE IS OK, IF NOT, THROWS AN ERROR  */
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
    
                /* PARSES THE RESPONSE INTO JSON FORMAT  */
                const result = await response.json();
    
                /* CHECKS IF THE RESPONSE IS SUCCESSFUL, IF SO, SETS THE STATE WITH THE FIRST OBJECT  */
                if (result.success && Array.isArray(result.response) && result.response.length > 0) {
                    setAboutData(result.response[0]); // Update state with the first object
                } else {
                    setError('No data available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1 className='text-4xl font-extralight'>{aboutData.about_title.toUpperCase()}</h1>
            <p className='md:my-10 my-2 whitespace-pre-line'>{aboutData.about_text}</p>
        </div>
    );
}