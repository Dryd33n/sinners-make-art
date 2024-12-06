"use client"

import React, { useEffect, useState } from 'react';

export default function AboutMe() {
    const [aboutData, setAboutData] = useState({ about_title: '', about_text: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/about_me'); // Ensure this matches your API route
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
    
                const result = await response.json();
                console.log('Data fetched successfully:', result);
    
                // Extract the first item from the response array
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
            <h1>{aboutData.about_title}</h1>
            <p>{aboutData.about_text}</p>
        </div>
    );
}