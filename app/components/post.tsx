import React from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ReactPlayer from 'react-player';

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

type PostProps = {
    post: Post;
};

export default function Post(props: PostProps) {
    const images = props.post.content.split(',').map((url: string) => ({
        original: url, // Use the full-size image
        thumbnail: url, // Generate thumbnails dynamically (adjust as needed)
    }));


    return (<>
        <div className="flex md:flex-row flex-col xl:mx-60 lg:mx-52 md:mx-40 sm: mx-10  object-fit my-5">
            <div className="flex-col mr-5 md:min-w-[30%] md:max-w-[30%] sm:min-w-[95%] sm:max-w-[95%] ">
                <h1 className='text-4xl font-extralight'>{props.post.title.toUpperCase()}</h1>
                <p className='my-10'>{props.post.description}</p>
            </div>

            <div>
                {props.post.type === 'image' ?
                    (<div className="flex-col flex-auto place-content-center mx-52">
                        <ImageGallery
                            items={images}
                            showThumbnails={false}
                            showPlayButton={false}
                            showBullets={true}
                            showNav={false}
                            showFullscreenButton={false}
                            autoPlay={true}
                            slideInterval={7500}
                        />
                    </div>)
                    : (<div className='h-64 pl-24'>
                        <ReactPlayer url={props.post.content} controls={true} width='200%' height='120%' />
                    </div>)}
            </div>
        </div>
        


    </>);
}