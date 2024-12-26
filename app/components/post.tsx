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
    const [screenWidth, setScreenWidth] = React.useState<number>(0);
    const [screenHeight, setScreenHeight] = React.useState<number>(0);

    const updateScreenSize = () => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
        console.log(screenWidth, screenHeight);
    };

    onresize = updateScreenSize;

    const images = props.post.content.split(',').map((url: string) => ({
        original: url, // Use the full-size image
        thumbnail: url, // Generate thumbnails dynamically (adjust as needed)
    }));


    return (<>
        <div className="w-full flex flex-col md:flex-row justify-center align my-20 gap-6 ">
            <div className="md:basis-1/3 w-full basis-1/5">
                <h1 className='text-4xl font-extralight'>{props.post.title.toUpperCase()}</h1>
                <div className='bg-white h-[0.1] w-full mt-5 relative '></div>
                <p className='mt-3'>{props.post.description}</p>
            </div>

            <div className='md:basis-2/3 basis-4/5 w-full '>
                {props.post.type === 'image' ?
                    (
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
                            additionalClass="custom-image-gallery"
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

        <style jsx global>{`
        .custom-image-gallery .image-gallery-fullscreen-button {
          opacity: 0.3; 
        }
      `}</style>
        


    </>);
}