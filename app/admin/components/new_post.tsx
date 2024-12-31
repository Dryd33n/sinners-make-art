"use client";

import React, { useEffect, useState } from "react";
import { PostItem } from "@/db/schema";
import PathSelector from "./shared/path_selector";
import VideoSelector from "./shared/video_selector";
import ImageSelector from "./shared/image_selector";

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}


/**
 * Component for creating a new post.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @example
 * <NewPost />
 * 
 * @remarks
 * This component allows users to create a new post by filling out a form with the post's title, description, and content.
 * Users can choose between an image post or a video post, and can optionally include the post in their portfolio.
 */
export default function NewPost() {
    /* FORM VARS */
    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);
    /* CONTENT VARS */
    const [imageLinks, setImageLinks] = useState<string[]>([""]);
    const [allImagesValid, setAllImagesValid] = useState<boolean>(false);
    const [videoString, setVideoString] = useState("");
    /* POSTS AND TAGS */
    const [allPosts, setAllPosts] = useState<PostItem[]>([]); // All available posts
    const [tag, setTag] = useState<PathItem>();
    /* ERROR AND SUCCESS MESSAGES */
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {fetchPosts();}, []);
    


    /**Fetches all posts from the server to check for the max order of the current tag
     * 
     */
    const fetchPosts = async () => {
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
    };

    

    /**Checks if the form is ready to be submitted by verifying that all fields are filled out
     * with valid data
     * 
     * @returns boolean - true if the form is ready to be submitted
     */
    const canSubmit = () => {
        const hasValidTitle = title.trim() !== "";
        const hasValidParagraph = paragraph.trim() !== "";
        const hasTag = tag !== undefined;

        const hasAtLeastOneImage = imageLinks.length > 0 && imageLinks.some((link) => link.trim() !== "");

        const validContent = imagePost ? (allImagesValid && hasAtLeastOneImage) : true;

        return hasValidTitle && hasValidParagraph && validContent && hasTag;
    };



    /** Handles the form submission
     * 
     * @param e react form event
     */
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
                        <PathSelector onSelect={(path) => setTag(path)} excludeOverriden={true} selectedPathMsg="Post Classified Under:"/>

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
                            (<ImageSelector imageLinks={imageLinks} setImageLinks={setImageLinks} setImagesValid={setAllImagesValid}/>)
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