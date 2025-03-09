'use client'

import React, { useState, useEffect } from 'react';
import Header from '../components/global/header';
import Post from '../components/global/post';
import NavBar from '../components/global/navBar';
import Footer from '../components/global/footer';
import Loading from '../components/global/loading';
import HomeButton from '../components/global/home_button';
import { PostItem } from '@/db/schema';

const PortfolioPage = () => {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);

   /**
     * Fetches all posts from the server.
     * 
     * This function sends a GET request to the '/api/posts' endpoint to retrieve all posts.
     * If the request is successful and the response contains a success flag, it updates the state
     * with the retrieved posts and sets a success message. If the request fails or the response
     * does not contain a success flag, it sets an error message.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the posts have been fetched and the state has been updated.
     */
   const fetchPosts = async (): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch('/api/posts');
        const result = await response.json();

        if (result.success) {


            fetchPortfolio(result.data);
        } else {
            console.error('Failed to fetch posts');

        }
    } catch (error) {
        console.error('Error fetching posts:', error);

    }
    }

    const fetchPortfolio = async (posts: PostItem[]): Promise<void> => {
        try {
            const response = await fetch('/api/manage_portfolio');
            const result = await response.json();

            if (result.success) {
                // find posts with id equal to post_id in result.data
                console.log("result: ", result.data);

                //create an array of post id's in result.data
                const postIds = result.data.map((post: { post_id: number }) => post.post_id);
                console.log("postIds: ", postIds);

                console.log("All posts from portfolio fetch: ", posts);

                // create a new array based of allPosts that have an id in postIds
                const portfolioPosts = postIds.map((id: number) => posts.find((post: PostItem) => post.id === id));

                console.log("Portfolio posts: ", portfolioPosts);

                setPosts(portfolioPosts);
                setLoading(false);
            } else {
                console.error('Failed to fetch portfolio');

            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
 
        }
    }

// Fetch posts on component mount
useEffect(() => { fetchPosts();}, []);



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