'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Post from '../components/post';
import NavBar from '../components/navBar';
import Footer from '../components/footer';

type Post = {
    id: number;
    title: string;
    description: string;
    type: string;
    content: string;
    tag: string;
    order: number;
    portfolio: boolean;
};

const PortfolioPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("/api/portfolio");
        
                if (!response.ok) {
                  throw new Error("Failed to fetch data");
                }
        
                const result = await response.json();

        
                if (result.success && result.data.length > 0) {
                    setPosts(result.data);
                } else {
                    console.error("No posts available");
                }
              } catch (error) {
                    console.error("Error fetching posts:", error);
              } finally {
                setLoading(false);
              }
        };

        fetchPosts();
        console.log("POSTS", posts);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header mainText="PORTFOLIO" />
            <NavBar />
            <div className='mt-20 mx-5 md:mx-20 lg:mx-40 xl:mx-64 2xl:mx-80'>
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default PortfolioPage;