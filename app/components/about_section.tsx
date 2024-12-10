"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import AboutMe from "./about_me";

export default function AboutSection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/about_me");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();

        if (result.success && result.response.length > 0) {
          // Assuming you take the first record's about_images
          const imageUrls = result.response[0].about_images.split(",").map((url: string) => url.trim());

          // Map image URLs into ImageGallery format
          const galleryItems = imageUrls.map((url: string) => ({
            original: url, // Use the full-size image
            thumbnail: `${url}?w=150&h=150`, // Generate thumbnails dynamically (adjust as needed)
          }));

          setImages(galleryItems);
        } else {
          setError("No images available");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("An error occurred while fetching images");
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
    <div className="flex flex-1 mx-72 mt-36">
      <div className="basis-1/2">
        <AboutMe />
      </div>

      <div className="basis-1/2">
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
      </div>
    </div>
  );
}
