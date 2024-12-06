"use client";

/* https://github.com/xiaolin/react-image-gallery */
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import AboutMe from "./about_me";


const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];
  
  export default function AboutSection() {
    
      return (
      <div className="flex flex-1 mx-72 mt-36 ">
        <div className="basis-1/2">
            <AboutMe />
        </div>

        <div className="basis-1/2">
            <ImageGallery items={images} 
                          showThumbnails={false} 
                          showPlayButton={false} 
                          showBullets={true}
                          showNav={false}
                          showFullscreenButton={false}
                          autoPlay={true} 
                          slideInterval={7500}/>
        </div>
      </div>
      );
    
  }