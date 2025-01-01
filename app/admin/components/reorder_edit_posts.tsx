'use client';
import { useEffect, useState } from "react";
import { PostItem } from "@/db/schema";
import PathSelector from "./shared/path_selector";
import ImageSelector from "./shared/image_selector";
import VideoSelector from "./shared/video_selector";

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}

export default function ReorderEditPosts() {
    {/* STATUS MESSAGES */ }
    const [reorderPostSuccessMessage, setReorderPostSuccessMessage] = useState("");
    const [reorderPostErrorMessage, setReorderPostErrorMessage] = useState("");
    const [updatePostSuccessMessage, setUpdateSuccessMessage] = useState("");
    const [updatePostErrorMessage, setUpdateErrorMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    {/* POST TAGS */ }
    const [tag, setTag] = useState<PathItem>();

    {/* POSTS */ }
    const [allPosts, setAllPosts] = useState<PostItem[]>([]); // All available posts
    const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([]); // Posts filtered by tag
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

    /* FORM VARS */
    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [allImagesValid, setAllImagesValid] = useState(false);
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);
    const [newTag, setNewTag] = useState<PathItem>();
    /* CONTENT VARS */
    const [imageLinks, setImageLinks] = useState<string[]>([""]);
    const [videoString, setVideoString] = useState("");

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setAllPosts(result.data);
                setReorderPostErrorMessage('')
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

    useEffect(() => {fetchPosts();}, []);

    const handleTagChange = async (path: PathItem) => {
        setTag(path);
        const filteredPosts = allPosts.filter((post) => post.tag === path.path);
        //sort posts by order property:
        filteredPosts.sort((a, b) => a.order - b.order);
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
        if (id === -1){
            console.log("Error specifying post to delete")
            return;
        }

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
            console.log('Error updating post order:', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let newOrder: number;
            if (tag?.path === newTag?.path) {
                newOrder = selectedPost?.order ?? 0;
            } else {
                const filtered = allPosts.filter(
                    (post) => newTag && post.tag.trim().toUpperCase() === newTag.path.trim().toUpperCase()
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
                    tag: newTag?.path,
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
            console.error("Error updating post:", error);
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
        setNewTag(tag);
        if (post.type === 'image') {
            const links = post.content.split(',');
            setImageLinks(links);
        } else {
            setVideoString(post.content);
        }
    }

    const handleCateogryChange = async (path: PathItem) => {
        setNewTag(path);
    }

    const canSubmit = () => {
        const validTitle = title.trim().length > 0;
        const validParagraph = paragraph.trim().length > 0;
        const validContent = imagePost ? allImagesValid : videoString.trim().length > 0;
        const validCategories = newTag? newTag.path.trim().length > 0 : false;
        return validTitle && validParagraph && validContent && validCategories;
    }




    return (<>
        <div className="flex flex-row gap-6">
            {/* SELECT CATEGORY */}
            <div className="basis-1/6">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium mb-4">
                        Manage Posts Under Category:
                    </label>
                    <PathSelector selectedPathMsg="Viewing Posts Tagged As:" 
                                  excludeOverriden={true} onSelect={(path) => 
                                  handleTagChange(path)}
                                  selectedPath={tag || { id: -1, path: '', linkOverride: '' }}/>
                </div>
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
                                            onClick={() => handleDeletePost(post.id || -1)}
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
                        <PathSelector excludeOverriden={true} 
                                      selectedPathMsg="Change Category to:" 
                                      onSelect={handleCateogryChange} 
                                      selectedPath={newTag || { id: -1, path: '', linkOverride: '' }}/>

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
                            <button className={`text-white basis-1/2 rounded-md p-2 
                        ${imagePost ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-grey-800 text-black hover:bg-grey-700'}`}
                                onClick={() => setImagePost(true)}
                                type="button">
                                Image Post
                            </button>
                            <button className={`text-white basis-1/2 rounded-md p-2
                        ${imagePost ? 'bg-grey-800 text-black hover:bg-grey-700' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                                onClick={() => setImagePost(false)}
                                type="button">
                                Video Post
                            </button>
                        </div>

                        {imagePost?
                            /* IMAGE LINKS */
                            (<ImageSelector imageLinks={imageLinks} 
                                            setImageLinks={setImageLinks} 
                                            setImagesValid={setAllImagesValid}/>)
                            :
                            /* VIDEO LINK */
                            (<VideoSelector onChange={(link) => setVideoString(link)} videoLink={videoString}/>)
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