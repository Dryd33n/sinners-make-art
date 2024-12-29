"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { PostItem } from "@/db/schema";
import PathSelector from "./shared/path_selector";
import VideoSelector from "./shared/video_selector";

interface ImageStatus {
    status: "loading" | "success" | "error";
}

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}

export default function NewPost() {
    /* FORM VARS */
    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);
    /* CONTENT VARS */
    const [imageLinks, setImageLinks] = useState<string[]>([""]);
    const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);
    const [videoString, setVideoString] = useState("");
    /* POSTS AND TAGS */
    const [allPosts, setAllPosts] = useState<PostItem[]>([]); // All available posts
    const [tag, setTag] = useState<PathItem>();
    /* ERROR AND SUCCESS MESSAGES */
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const fetchPosts = async () => {
        console.log("Fetching posts");

        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setAllPosts(result.data);
                setErrorMessage('');
                setSuccessMessage('posts successfully loaded');
            } else {
                console.error('Failed to fetch posts');
                setErrorMessage('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setErrorMessage('Error fetching posts');
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);


    // Calculate whether the form can be submitted
    const canSubmit = () => {
        const hasValidTitle = title.trim() !== "";
        const hasValidParagraph = paragraph.trim() !== "";
        const hasTag = tag !== undefined;

        const hasAtLeastOneImage = imageLinks.length > 0 && imageLinks.some((link) => link.trim() !== "");
        const allImagesValid = imageStatuses.every((status) => status.status === "success");

        const validContent = imagePost ? (allImagesValid && hasAtLeastOneImage) : true;

        return hasValidTitle && hasValidParagraph && validContent && hasTag;
    };

    // Handle change for image links
    const handleImageLinkChange = (index: number, value: string) => {
        const updatedLinks = [...imageLinks];
        updatedLinks[index] = value;
        setImageLinks(updatedLinks);
        checkImageStatus(index, value);
    };

    // Add a new image link input
    const handleAddImageLink = () => {
        setImageLinks((prevLinks) => [...prevLinks, ""]);
        setImageStatuses((prevStatuses) => [...prevStatuses, { status: "loading" }]);
    };

    // Remove an image link input
    const handleRemoveImageLink = (index: number) => {
        const updatedLinks = imageLinks.filter((_, i) => i !== index);
        const updatedStatuses = imageStatuses.filter((_, i) => i !== index);
        setImageLinks(updatedLinks);
        setImageStatuses(updatedStatuses);
    };

    // Check if an image URL is valid by attempting to load it
    const checkImageStatus = (index: number, url: string) => {
        if (!url) return;

        const image = new window.Image();
        image.src = url;
        image.onload = () => updateImageStatus(index, "success");
        image.onerror = () => updateImageStatus(index, "error");
    };

    // Update the status of the image (loading, success, error)
    const updateImageStatus = (index: number, status: "loading" | "success" | "error") => {
        setImageStatuses((prevStatuses) => {
            const updatedStatuses = [...prevStatuses];
            updatedStatuses[index] = { status };
            return updatedStatuses;
        });
    };

    const handleCateogryChange = (path: PathItem) => {
        const filtered = allPosts.filter(
            (post) => post.tag.trim().toUpperCase() === path.path.trim().toUpperCase()
        );
    
        console.log(
            "Filtering ", allPosts.length, 
            " posts by tag", path.path, 
            "\n Found ", filtered.length, 
            " matching posts: ", filtered
        );
    
        setTag(path); // Updates the current tag
    };
    


    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const csvString = imageLinks.filter((link) => link.trim() !== "").join(",");
            
            let maxOrder = 0;
            if (tag) {
                const filtered = allPosts.filter(
                    (post) => post.tag.trim().toUpperCase() === tag.path.trim().toUpperCase()
                );
                maxOrder = filtered.reduce((max, post) => (post.order > max ? post.order : max), 0);
            }
    
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: paragraph,
                    type: imagePost ? "image" : "video",
                    content: imagePost ? csvString : videoString,
                    tag: tag?.path,
                    order: maxOrder + 1,
                    portfolio: includeInPortfolio,
                }),
            });
    
            const result = await response.json();
    
            if (result.success) {
                setSuccessMessage("Post uploaded successfully");
                fetchPosts(); // Refresh posts after successful upload
                // CLEAR FORM
                setTitle("");
                setParagraph("");
                setImageLinks([""]);
                setImageStatuses([{ status: "loading" }]);
                setVideoString("");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again later. " + error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="">
            <div className="p-4 max-w-6xl mx-auto bg-grey-850 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Create New Post:</h2>

                <form onSubmit={handleSubmit} className="flex flex-row gap-6">
                    {/* Left Side */}
                    <div className=" flex-1 basis-1/3">
                        <PathSelector onSelect={handleCateogryChange} excludeOverriden={true} selectedPathMsg="Post Classified Under:"/>

                        {/* Include in Portfolio Checkbox */}
                        <div className="mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={includeInPortfolio}
                                    onChange={(e) => setIncludeInPortfolio(e.target.checked)}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-lg font-medium">Include in Portfolio</span>
                            </label>
                        </div>

                    </div>

                    {/* Middle */}
                    <div className=" flex-1 basis-1/3">
                        {/* Title */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-lg font-medium mb-4">
                                Post Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Enter post title"
                            />
                        </div>

                        {/* Paragraph */}
                        <div className="mb-4">
                            <label htmlFor="aboutMe" className="block text-lg font-medium mb-4">
                                Post Description:
                            </label>
                            <textarea
                                id="aboutMe"
                                value={paragraph}
                                onChange={(e) => setParagraph(e.target.value)}
                                rows={10}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Write about post description"
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className=" flex-1 basis-1/3 flex-grow flex-col">
                        <label htmlFor="title" className="block text-lg font-medium mb-4">
                            Post Content:
                        </label>

                        <div className="flex">
                            <button className={`text-white basis-1/2 rounded-md p-2 hover:bg-grey-700
                        ${imagePost ? 'bg-blue-500 text-white' : 'bg-grey-800 text-black'}`}
                                onClick={() => setImagePost(true)}
                                type="button">
                                Image Post
                            </button>
                            <button className={`text-white basis-1/2 rounded-md p-2 hover:bg-grey-700
                        ${!imagePost ? 'bg-blue-500 text-white' : 'bg-grey-800 text-black'}`}
                                onClick={() => setImagePost(false)}
                                type="button">
                                Video Post
                            </button>
                        </div>

                        {imagePost ?
                            /* IMAGE LINKS */
                            (<div className="bg-grey-700 p-2">
                                <h3 className="text-lg font-medium mb-4">Image Links</h3>

                                {imageLinks.map((link, index) => (
                                    <div key={index} className="mb-4 flex items-center">
                                        <input
                                            type="url"
                                            value={link}
                                            onChange={(e) => handleImageLinkChange(index, e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded mr-2 text-black"
                                            placeholder="Enter image URL"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImageLink(index)}
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                        {imageStatuses[index]?.status === "loading" && <p className="text-gray-500 ml-2">Loading...</p>}
                                        {imageStatuses[index]?.status === "success" && (
                                            <Image
                                                src={link}
                                                alt={`Preview ${index}`}
                                                width={150}
                                                height={150}
                                                className="ml-2 w-16 h-16 object-cover border border-gray-300 rounded"
                                            />
                                        )}
                                        {imageStatuses[index]?.status === "error" && (
                                            <p className="text-red-500 ml-2">Invalid image URL</p>
                                        )}
                                    </div>
                                ))}
                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={handleAddImageLink}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Add Image Link
                                    </button>
                                </div>
                            </div>)
                            :
                            /* VIDEO LINK */
                            (<VideoSelector onChange={(videoLink) => setVideoString(videoLink)}/>)
                        }

                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20 mt-5 w-full"
                            disabled={isSubmitting || !canSubmit()}
                        >
                            {isSubmitting ? "Uploading..." : "Upload Post"}
                        </button>
                    </div>

                </form>

                {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
                {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
            </div>
        </div>
    );
};