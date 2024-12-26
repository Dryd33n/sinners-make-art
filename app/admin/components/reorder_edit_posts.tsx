'use client';
import Tooltip from "@/app/components/tooltip";
import { assert } from "console";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import ReactPlayer from 'react-player';

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}

interface ImageStatus {
    status: "loading" | "success" | "error";
}

interface PostItem {
    id: number;
    title: string;
    description: string;
    type: string;        // photo or video
    content: string;     // images urls csv or video link
    tag: string;         // category
    order: number;       // order in category
    portfolio: boolean;  // show in portfolio
}

export default function ReorderEditPosts() {
    {/* STATUS MESSAGES */ }
    const [categorySuccessMessage, setCategorySuccessMessage] = useState("");
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
    const [reorderPostSuccessMessage, setReorderPostSuccessMessage] = useState("");
    const [reorderPostErrorMessage, setReorderPostErrorMessage] = useState("");
    const [updatePostSuccessMessage, setUpdateSuccessMessage] = useState("");
    const [updatePostErrorMessage, setUpdateErrorMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    {/* POST TAGS */ }
    const [allPaths, setAllPaths] = useState<PathItem[]>([]); // All available paths
    const [tag, setTag] = useState<PathItem>();

    {/* POSTS */ }
    const [allPosts, setAllPosts] = useState<PostItem[]>([]); // All available posts
    const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([]); // Posts filtered by tag
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

    /* FORM VARS */
    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);
    const [tagId, setTagId] = useState("");
    const [filteredTagPosts, setFilteredTagPosts] = useState<PostItem[]>([]);
    /* CONTENT VARS */
    const [imageLinks, setImageLinks] = useState<string[]>([""]);
    const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);
    const [videoString, setVideoString] = useState("");

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setAllPosts(result.data);
                setReorderPostErrorMessage
                setReorderPostSuccessMessage('All posts successfully loaded');
            } else {
                console.error('Failed to fetch posts');
                setReorderPostSuccessMessage('');
                setReorderPostErrorMessage('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setReorderPostSuccessMessage('');
            setReorderPostErrorMessage('Error fetching posts');
        }
    }

    useEffect(() => {
        const fetchPaths = async () => {
            try {
                const response = await fetch('/api/admin/navtree/overrides');
                const result = await response.json();

                if (result.success) {
                    setAllPaths(result.data.filter((item: PathItem) => item.linkOverride == 'auto'));
                    setCategoryErrorMessage('');
                    setCategorySuccessMessage('Tags successfully loaded');
                } else {
                    console.error('Failed to fetch tags');
                    setCategorySuccessMessage('');
                    setCategoryErrorMessage('Failed to fetch tags');
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
                setCategorySuccessMessage('');
                setCategoryErrorMessage('Error fetching tags');
            }
        };

        fetchPaths();



        fetchPosts();
    }, []);

    const handleTagChange = async (path: PathItem) => {
        setTag(path);
        const filteredPosts = allPosts.filter((post) => post.tag === path.path);
        setFilteredPosts(filteredPosts);
        setSelectedPost(null);

        if (filteredPosts.length === 0) {
            setReorderPostSuccessMessage('');
            setReorderPostErrorMessage('No posts available for this tag');
        } else {
            setReorderPostErrorMessage('');
            setReorderPostSuccessMessage(`Found ${filteredPosts.length} posts matching this tag`);
        }

    }

    const handleDeletePost = (id: number) => {
        deletePost(id);
        fetchPosts();
        setFilteredPosts(filteredPosts.filter(post => post.id !== id));
        setAllPosts(allPosts.filter(post => post.id !== id));
        setSelectedPost(null);
        
    };

    const deletePost = async (id: number) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(id), // Pass the post ID in the body
            });

            const result = await response.json();

            if (result.success) {
                setReorderPostErrorMessage('');
                setReorderPostSuccessMessage("Post deleted successfully");
            } else {
                console.error('Error deleting post:', result.error);
                setReorderPostErrorMessage("Error deleting post");
                setReorderPostSuccessMessage('');
            }
        } catch (error) {
            console.error('Error in deletePost function:', error);
            setReorderPostErrorMessage("Error deleting post");
            setReorderPostSuccessMessage('');
        }
    };


    const handleMoveUp = (index: number) => {
        const updatedPosts = [...filteredPosts];
        [updatedPosts[index - 1], updatedPosts[index]] = [updatedPosts[index], updatedPosts[index - 1]];
        updatePostOrder(updatedPosts);
        setFilteredPosts(updatedPosts);
    };


    const handleMoveDown = (index: number) => {
        const updatedPosts = [...filteredPosts];
        [updatedPosts[index], updatedPosts[index + 1]] = [updatedPosts[index + 1], updatedPosts[index]];
        updatePostOrder(updatedPosts);
        setFilteredPosts(updatedPosts);
    };

    const updatePostOrder = async (updatedPosts: PostItem[]) => {
        try {
            const updates = updatedPosts.map((post, index) => ({ id: post.id, order: index + 1 }));
            const response = await fetch('/api/posts/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
            });
            const result = await response.json();

            if (result.success) {
                setReorderPostErrorMessage('');
                setReorderPostSuccessMessage("Post order updated successfully");
            } else {
                setReorderPostSuccessMessage('');
                setReorderPostErrorMessage("Failed to update post order");
            }
        } catch (error) {
            setReorderPostSuccessMessage('');
            setReorderPostErrorMessage("Error updating post order");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let newOrder: number;
            if (tag?.path === tagId) {
                newOrder = selectedPost?.order ?? 0;
            } else {
                const filtered = allPosts.filter(
                    (post) => post.tag.trim().toUpperCase() === tagId.trim().toUpperCase()
                );
                newOrder = filtered.reduce((max, post) => (post.order > max ? post.order : max), 0) + 1;
            }

            const response = await fetch("/api/posts", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedPost?.id,
                    title: title,
                    description: paragraph,
                    type: imagePost ? "image" : "video",
                    content: imagePost ? imageLinks.join(',') : videoString,
                    tag: tagId,
                    order: newOrder,
                    portfolio: includeInPortfolio,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setUpdateErrorMessage("");
                setUpdateSuccessMessage("Post updated successfully");
                fetchPosts(); // Refresh posts after successful upload
            } else {
                setUpdateSuccessMessage("");
                setUpdateErrorMessage("An error occurred. Please try again later.");
            }
        } catch (error) {
            setUpdateErrorMessage("An error occurred. Please try again later.");
            setUpdateSuccessMessage("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectPost = (post: PostItem) => {
        setSelectedPost(post);
        loadSelectedPost(post);
    }

    const loadSelectedPost = (post: PostItem) => {
        setTitle(post.title);
        setParagraph(post.description);
        setIncludeInPortfolio(post.portfolio);
        setImagePost(post.type === 'image');
        setTagId(post.tag);
        if (post.type === 'image') {
            const links = post.content.split(',');
            setImageLinks(links);
            links.forEach((link, index) => checkImageStatus(index, link));
        } else {
            setVideoString(post.content);
        }
    }

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

    const handleCateogryChange = async (path: PathItem) => {
        const filtered = allPosts.filter(
            (post) => post.tag.trim().toUpperCase() === path.path.trim().toUpperCase()
        );

        setTagId(path.path);
        setFilteredTagPosts(filtered);
    }

    const canSubmit = () => {
        return true;
    }




    return (<>
        <div className="flex flex-row gap-6">
            {/* SELECT CATEGORY */}
            <div className="basis-1/6">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium mb-4">
                        Manage Posts Under Category:
                    </label>
                    <div className="flex content-center">
                        <Tooltip>
                            <p>Tags / Categories with a link overide set cannot be selected</p>
                        </Tooltip>
                        <h2 className="font-semibold mb-2 mt-[2]">Available Paths</h2>
                    </div>
                    <div className="h-[500] overflow-y-auto bg-grey-700 rounded-md p-2">
                        {allPaths.map((path) => (
                            <div
                                key={path.id}
                                className="flex justify-between items-center p-2 hover:bg-grey-600 cursor-pointer"
                                onClick={() => handleTagChange(path)}
                            >
                                <span className="text-white">{path.path}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {categorySuccessMessage && <p className="text-green-500">{categorySuccessMessage}</p>}
                {categoryErrorMessage && <p className="text-red-500">{categoryErrorMessage}</p>}
            </div>

            {/* SELECT AND REORDER POSTS */}

            <div className="basis-1/6">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium mb-[50]">
                        Posts Tagged with {tag?.path || "None"}:
                    </label>
                    {tag ? (<div className="h-[500] overflow-y-auto bg-grey-700 rounded-md p-2">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    onClick={() => handleSelectPost(post)}
                                    className={`flex flex-col p-2 mb-2 border-b border-grey-600 cursor-pointer 
                                        ${selectedPost?.id === post.id ? "bg-blue-700" : "bg-grey-700"}
                                    `}
                                >
                                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                                    <p className="text-sm text-grey-400">{post.description}</p>
                                    <span className="text-sm text-grey-500">Type: {post.type}</span>

                                    {/* Action Buttons */}
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="px-4 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleMoveUp(index)}
                                            className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            disabled={index === 0}
                                        >
                                            Move Up
                                        </button>
                                        <button
                                            onClick={() => handleMoveDown(index)}
                                            className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            disabled={index === filteredPosts.length - 1}
                                        >
                                            Move Down
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-grey-500">No posts available for this tag.</p>
                        )}
                    </div>) : (<h1 className="font-bold text-red-500">SELECT A CATEGORY FIRST</h1>)}
                </div>

                {reorderPostErrorMessage && <p className="text-red-500">{reorderPostErrorMessage}</p>}
                {reorderPostSuccessMessage && <p className="text-green-500">{reorderPostSuccessMessage}</p>}
            </div>


            {/* EDIT POST */}
            <div className="basis-4/6">
                <label htmlFor="title" className="block text-lg font-medium mb-4 ">
                    Edit Post:
                </label>
                {selectedPost ? (<form onSubmit={handleUpdate} className="flex flex-row gap-6 bg-grey-900 p-2 rounded-md">
                    {/* Left Side */}

                    <div className=" flex-1 basis-1/4">
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
                                        onClick={() => handleCateogryChange(path)}
                                    >
                                        <span className="text-white">{path.path}</span>
                                    </div>
                                ))}
                            </div>
                            <h2 className="font-semibold mt-3 mb-2">Post Classified Under:</h2>
                            <p className="bg-grey-700 rounded-md p-2">
                                {tagId}
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
                    <div className=" flex-1 basis-1/4">
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
                    <div className=" flex-1 basis-1/2 flex-grow flex-col">
                        <label htmlFor="title" className="block text-lg font-medium mb-4">
                            Post Content:
                        </label>

                        <div className="flex">
                            <button className={`text-white basis-1/2 rounded-md p-2 hover:bg-grey-700
                        ${selectedPost?.type === 'image' ? 'bg-blue-500 text-white' : 'bg-grey-800 text-black'}`}
                                onClick={() => setImagePost(true)}
                                type="button">
                                Image Post
                            </button>
                            <button className={`text-white basis-1/2 rounded-md p-2 hover:bg-grey-700
                        ${selectedPost?.type === 'video' ? 'bg-blue-500 text-white' : 'bg-grey-800 text-black'}`}
                                onClick={() => setImagePost(false)}
                                type="button">
                                Video Post
                            </button>
                        </div>

                        {selectedPost?.type === 'image' ?
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
                                        <p>Video links from the following sites are supported:</p>
                                        <ol className="list-disc pl-4">
                                            <li>Youtube</li>
                                            <li>Vimeo</li>
                                            <li>DailyMotion</li>
                                            <li>Facebook</li>
                                            <li>Streamable</li>
                                            <li>Twitch</li>
                                        </ol>
                                        <p>And more... Refer to guide for all supported formats</p>
                                    </Tooltip>
                                    <h3 className="text-lg font-medium mb-4">Video Embed</h3>
                                </div>
                                <label>
                                    Enter Video Embed Code:
                                    <textarea
                                        value={videoString}
                                        onChange={(e) => setVideoString(e.target.value)}
                                        rows={2}
                                        cols={41}
                                        placeholder="Paste your video link here:"
                                        className=" p-2 border border-gray-300 rounded text-black m-2"
                                    />
                                </label>
                                <h3 className="text-lg font-medium mb-4">Video Preview</h3>
                                {videoString ? (
                                    <ReactPlayer url={videoString}
                                        controls={true}
                                        width={400}
                                        height={230} />
                                ) : (
                                    <p>No preview available. Paste an video link to see the result.</p>
                                )}
                            </div>)
                        }

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20 mt-5 w-full"
                            disabled={isSubmitting || !canSubmit()}
                        >
                            {isSubmitting ? "Updating..." : "Update Post"}
                        </button>
                        {updatePostSuccessMessage && <p className="text-green-500">{updatePostSuccessMessage}</p>}
                        {updatePostErrorMessage && <p className="text-red-500">{updatePostErrorMessage}</p>}
                    </div>

                </form>) : (<h1 className="font-bold text-red-500">SELECT A POST FIRST</h1>)}

            </div>

        </div>
    </>)
}