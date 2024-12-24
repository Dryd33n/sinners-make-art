"use client";

import React, { useEffect, useState } from "react";
import Image from 'next/image';
import Tooltip from "@/app/components/tooltip";

interface ImageStatus {
    status: "loading" | "success" | "error";
}

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}

const NewPost = () => {
    const [title, setTitle] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [paragraph, setParagraph] = useState("");
    const [imageLinks, setImageLinks] = useState<string[]>([""]);
    const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);
    const [embedString, setEmbedString] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [allPaths, setAllPaths] = useState<PathItem[]>([]); // All available paths
    const [tag, setTag] = useState<PathItem>();
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const response = await fetch('/api/admin/navtree/overrides');
                const result = await response.json();

                console.log('Fetched paths:', result);

                if (result.success) {
                    setAllPaths(result.data.filter((item: PathItem) => item.linkOverride == 'auto'));
                    setErrorMessage('');
                    setSuccessMessage('Tags successfully loaded');
                } else {
                    console.error('Failed to fetch tags');
                    setErrorMessage('Failed to fetch tags');
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
                setErrorMessage('Error fetching tags');
            }
        };

        fetchPaths();
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

    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // Handle paragraph change
    const handleParagraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setParagraph(e.target.value);
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

    const handleEmbedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEmbedString(e.target.value);
        console.log("Embed String:", embedString);
    };

    // Populate the form with current data
    const handleLoadData = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch("/api/about_me");

            if (!response.ok) {
                throw new Error("Failed to load current data");
            }

            const result = await response.json();

            if (result.success && result.response.length > 0) {
                const data = result.response[0];
                setTitle(data.about_title || "");
                setParagraph(data.about_text || "");

                const links = data.about_images ? data.about_images.split(",").map((url: string) => url.trim()) : [""];
                setImageLinks(links);

                // Update image statuses
                const statuses = links.map(() => ({ status: "loading" }));
                setImageStatuses(statuses);

                // Validate image links
                links.forEach((link: string, index: number) => checkImageStatus(index, link));
                setSuccessMessage("Data loaded successfully");
            } else {
                setErrorMessage("No data available to load");
            }
        } catch (error) {
            console.error("Error loading current data:", error);
            setErrorMessage("An error occurred while loading data");
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        console.log("Submitting new post: \nTitle:", title, "\nParagraph:", paragraph, "\nType:", imagePost ? "Image" : "Video", "\nTags:", tag);

        try {
            const csvString = imageLinks.filter((link) => link.trim() !== "").join(",");
            console.log("CSV Image Links:", csvString);

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: paragraph,
                    type: imagePost ? "image" : "video",
                    content: imagePost ? csvString : embedString,
                    tag: tag?.path,
                    portfolio: includeInPortfolio,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage("Post uploaded successfully");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again later." + error);
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
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-lg font-medium mb-4">
                                Post Category:
                            </label>
                            <div className="flex content-center">
                                <Tooltip>
                                    <p>Tags / Categories with a link overide set cannot be selected</p>
                                </Tooltip>
                                <h2 className="font-semibold mb-2 mt-[2]">Available Paths</h2>
                            </div>
                            <div className="h-64 overflow-y-auto bg-grey-700 rounded-md p-2">
                                {allPaths.map((path) => (
                                    <div
                                        key={path.id}
                                        className="flex justify-between items-center p-2 hover:bg-grey-600 cursor-pointer"
                                        onClick={() => setTag(path)}
                                    >
                                        <span className="text-white">{path.path}</span>
                                    </div>
                                ))}
                            </div>
                            <h2 className="font-semibold mt-3 mb-2">Post Classified Under:</h2>
                            <p className="bg-grey-700 rounded-md p-2">
                                {tag?.path}
                            </p>
                        </div>

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
                                onChange={handleTitleChange}
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
                                onChange={handleParagraphChange}
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
                            (<div className="bg-grey-700 p-2">
                                <div className="flex">
                                    <Tooltip>
                                        <p>Make sure you use embed links from trusted sources only since this form can be easily exploited</p>
                                    </Tooltip>
                                    <h3 className="text-lg font-medium mb-4">Video Embed</h3>
                                </div>
                                <label>
                                    Enter Video Embed Code:
                                    <textarea
                                        value={embedString}
                                        onChange={handleEmbedChange}
                                        rows={4}
                                        cols={41}
                                        placeholder="Paste your video embed string here"
                                        className=" p-2 border border-gray-300 rounded text-black m-2"
                                    />
                                </label>
                                <h3 className="text-lg font-medium mb-4">Video Preview</h3>
                                {embedString ? (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: embedString }}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px",
                                            borderRadius: "5px",
                                            overflow: "hidden",
                                        }}
                                    />
                                ) : (
                                    <p>No preview available. Paste an embed string to see the result.</p>
                                )}
                            </div>)
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

export default NewPost;
