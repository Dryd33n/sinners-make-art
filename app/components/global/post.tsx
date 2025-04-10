"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-image-gallery/styles/css/image-gallery.css';

// Dynamically import ImageGallery to avoid SSR issues
const ImageGallery = dynamic(() => import('react-image-gallery'), { ssr: false });
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });


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
            <div>{screenWidth > 768 ? <WebPost post={props.post} /> : <MobilePost post={props.post} />}</div>
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
        originalAlt: props.post.title, // Alt text for full-size image
    }));

    return (
        <>
        <div className="flex flex-wrap min-h-full mb-40 mt-10">
            <div className='mx-5 md:mx-20 lg:mx-40 xl:mx-64 2xl:mx-80 h-fit '>
                <div className="float-right ml-14 mb-5 grid items-center" style={{width: screenWidth * 0.43}}>
                                    <div>
                                        {props.post.type === 'image' ? (
                                            <div className="flex-col flex-auto place-content-center">
                                                <ImageGallery
                                                    items={images}
                                                    showThumbnails={false}
                                                    showPlayButton={false}
                                                    showBullets={images.length === 1 ? false : true}
                                                    showNav={false}
                                                    showFullscreenButton={true}
                                                    autoPlay={true}
                                                    slideInterval={7500}
                                                    useBrowserFullscreen={false}
                                                />
                                            </div>
                                        ) : (
                                            <div className='grid place-content-center my-auto'>
                                                    <div className='my-auto' style={{ width: `${screenWidth / 2.5}px`, height: `${(screenWidth / 2.5) * (9 / 18)}px` }} >
                                                        <div className='w-full h-full'>
                                                            <ReactPlayer url={`${props.post.content}?origin=http://localhost:3000`} controls={true} height='100%' width='100%' />
                                                        </div>
                                                    </div>
                                            </div>
                                        )}
                                    </div>
                </div>
                <div>
                            <div style={{width: (screenWidth -200) * 0.8}}></div>
                                <h1 className="text-4xl font-extralight">{props.post.title.toUpperCase()}</h1>
                                <div className="bg-white h-0.5 mt-5 w-fit" style={{width: (screenWidth -200) * 0.24}}></div>
                            </div>
                            <p className="mt-3 whitespace-pre-line">{props.post.description}</p>
                </div>
            </div>
        </>
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

    return (<>
        <div className='mx-5 md:mx-20 lg:mx-40 xl:mx-64 2xl:mx-80'>
            <div className=" flex flex-col">
                <div className="basis-0">
                    {props.post.type === 'image' ? (
                        <div className="">
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
                        <div className='mx-auto mb-5 mt-20' style={{ width: `${screenWidth *0.8}px`, height: `${(screenWidth * 0.8) * (9 / 18)}px` }} >
                        <div className='w-full h-full'>
                            <ReactPlayer url={`${props.post.content}?origin=http://localhost:3000`} controls={true} height='100%' width='100%' />
                        </div>
                    </div>
                    )}
                </div>
            </div>
            
        </div>
                        <div className='mt-5 basis-1'>
                        <h1 className="text-4xl font-extralight">{props.post.title.toUpperCase()}</h1>
                        <div className="bg-white h-0.5 w-full mt-5"></div>
                        <p className="mt-3 whitespace-pre-line">{props.post.description}</p>
                    </div> </>
    );
}