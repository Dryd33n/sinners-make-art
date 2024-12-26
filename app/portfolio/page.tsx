'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Post from '../components/post';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import Loading from '../components/loading';
import Head from 'next/head';

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