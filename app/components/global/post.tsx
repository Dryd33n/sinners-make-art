"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactPlayer from 'react-player';
import 'react-image-gallery/styles/css/image-gallery.css';

// Dynamically import ImageGallery to avoid SSR issues
const ImageGallery = dynamic(() => import('react-image-gallery'), { ssr: false });

interface PostProps {
    post: {
        title: string;
        description: string;
        content: string;
        type: string;
    };
}

export default function Post(props: PostProps) {
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', updateScreenSize);

        // Initial screen size
        updateScreenSize();

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    return (
        <>
            <div className='mb-40 sm:mb-0'>{screenWidth > 768 ? <WebPost post={props.post} /> : <MobilePost post={props.post} />}</div>
        </>
    );
}

function WebPost(props: PostProps) {
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', updateScreenSize);

        // Initial screen size
        updateScreenSize();

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    const images = props.post.content.split(',').map((url: string) => ({
        original: url, // Use the full-size image
        thumbnail: url, // Generate thumbnails dynamically (adjust as needed)
    }));

    return (
        <div className='mx-5 md:mx-20 lg:mx-40 xl:mx-64 2xl:mx-80'>
            <div className="w-full flex flex-col md:flex-row justify-center my-10 gap-6">
                <div className={`md:basis-1/3 w-full basis-1/5 ${screenWidth < 768 ? 'mb-10' : 'mr-10'}`}>
                    <h1 className="text-4xl font-extralight">{props.post.title.toUpperCase()}</h1>
                    <div className="bg-white h-0.5 w-full mt-5"></div>
                    <p className="mt-3">{props.post.description}</p>
                </div>
                <div className="md:basis-2/3 basis-4/5 w-full">
                    {props.post.type === 'image' ? (
                        <div className="flex-col flex-auto place-content-center">
                            <ImageGallery
                                items={images}
                                showThumbnails={false}
                                showPlayButton={false}
                                showBullets={true}
                                showNav={false}
                                showFullscreenButton={true}
                                autoPlay={true}
                                slideInterval={7500}
                            />
                        </div>
                    ) : (
                        <div className='grid place-content-center'>
                            <div className='h-[180] w-[350] sm:h-[300] sm:w-[500] md:h-[300] md:w-[500] lg:h-[400] lg:w-[600]'>
                                <div className='w-full h-full'>
                                    <ReactPlayer url={props.post.content} controls={true} height='100%' width='100%' />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MobilePost(props: PostProps) {
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        const updateScreenSize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', updateScreenSize);

        // Initial screen size
        updateScreenSize();

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);

    const images = props.post.content.split(',').map((url: string) => ({
        original: url, // Use the full-size image
        thumbnail: url, // Generate thumbnails dynamically (adjust as needed)
    }));

    return (
        <div className='mx-5 md:mx-20 lg:mx-40 xl:mx-64 2xl:mx-80'>
            <div className="w-full flex flex-col md:flex-row justify-center my-10 gap-6">
                <div className="md:basis-2/3 basis-4/5 w-full">
                    {props.post.type === 'image' ? (
                        <div className="flex-col flex-auto place-content-center">
                            <ImageGallery
                                items={images}
                                showThumbnails={false}
                                showPlayButton={false}
                                showBullets={true}
                                showNav={false}
                                showFullscreenButton={true}
                                autoPlay={true}
                                slideInterval={7500}
                            />
                        </div>
                    ) : (
                        <div className='grid place-content-center h-[180] w-[350] sm:h-[300] sm:w-[500] md:h-[300] md:w-[500] lg:h-[400] lg:w-[600]'>
                                <div className='w-full h-full'>
                                    <ReactPlayer url={props.post.content} controls={true} height='100%' width='100%' />
                                </div>
                        </div>
                    )}
                </div>
                <div className={`md:basis-1/3 w-full basis-1/5 ${screenWidth < 768 ? 'mb-10' : 'mr-10'}`}>
                    <h1 className="text-4xl font-extralight">{props.post.title.toUpperCase()}</h1>
                    <div className="bg-white h-0.5 w-full mt-5"></div>
                    <p className="mt-3">{props.post.description}</p>
                </div>
            </div>
        </div>
    );
}