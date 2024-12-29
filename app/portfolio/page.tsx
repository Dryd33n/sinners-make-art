'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/global/header';
import Post from '../components/post';
import NavBar from '../components/global/navBar';
import Footer from '../components/global/footer';
import Loading from '../components/global/loading';
import HomeButton from '../components/global/home_button';

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
        document.title = "Portfolio | Sinners Make Art";

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
    }, []);

    if (loading) {
        return <div><Loading/></div>;
    }

    return (
        <>
            <HomeButton />
            <Header mainText="PORTFOLIO" />
            <NavBar />
            <div className='mt-20'>
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </div>
            <Footer />
        </>
    );
};

export default PortfolioPage;