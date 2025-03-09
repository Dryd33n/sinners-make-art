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

/**
 * Component for reordering and editing posts in the admin panel.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @description
 * This component allows the admin to manage posts by category, reorder posts, and edit post details.
 * It includes functionalities to fetch posts, filter posts by tag, delete posts, move posts up or down in order,
 * and update post details including title, description, type (image or video), content, and category.
 *
 * @example
 * <ReorderEditPosts />
 *
 * @remarks
 * The component uses several state variables to manage the posts and their properties:
 * - `reorderPostSuccessMessage`, `reorderPostErrorMessage`, `updatePostSuccessMessage`, `updatePostErrorMessage`: Status messages for various operations.
 * - `isSubmitting`: Indicates if a form submission is in progress.
 * - `tag`, `newTag`: The current and new tags for filtering and updating posts.
 * - `allPosts`, `filteredPosts`, `selectedPost`: Arrays and objects to manage all posts, filtered posts, and the currently selected post.
 * - `title`, `paragraph`, `imagePost`, `allImagesValid`, `includeInPortfolio`, `imageLinks`, `videoString`: Variables for managing post details.
 */
export default function ReorderEditPosts(): JSX.Element {
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



    /**
     * Fetches all posts from the server.
     * 
     * This function sends a GET request to the '/api/posts' endpoint to retrieve all posts.
     * If the request is successful and the response contains a success flag, it updates the state
     * with the retrieved posts and sets a success message. If the request fails or the response
     * does not contain a success flag, it sets an error message.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the posts have been fetched and the state has been updated.
     */
    const fetchPosts = async (): Promise<void> => {
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

    // Fetch posts on component mount
    useEffect(() => {fetchPosts();}, []);



    /**
     * Handles the change of the selected tag and updates the filtered posts accordingly.
     * 
     * @param {PathItem} path - The selected tag path item.
     * @returns {Promise<void>} - A promise that resolves when the tag change handling is complete.
     * 
     * This function performs the following actions:
     * 1. Sets the selected tag.
     * 2. Filters the posts based on the selected tag.
     * 3. Sorts the filtered posts by their order property.
     * 4. Updates the state with the filtered posts and resets the selected post.
     * 5. Sets success or error messages based on the availability of posts for the selected tag.
     */
    const handleTagChange = async (path: PathItem): Promise<void> => {
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



    /**
     * Handles the deletion of a post by its ID.
     *
     * @param {number} id - The ID of the post to delete. If the ID is -1, an error message is logged and the function returns early.
     *
     * This function performs the following actions:
     * - Logs an error message if the ID is -1.
     * - Calls the `deletePost` function to delete the post with the specified ID.
     * - Calls the `fetchPosts` function to refresh the list of posts.
     * - Updates the `filteredPosts` state by removing the post with the specified ID.
     * - Updates the `allPosts` state by removing the post with the specified ID.
     * - Sets the `selectedPost` state to `null`.
     */
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


    
    /**
     * Deletes a post by its ID.
     *
     * This function sends a DELETE request to the '/api/posts' endpoint with the post ID in the request body.
     * If the deletion is successful, it sets a success message. Otherwise, it sets an error message.
     *
     * @param {number} id - The ID of the post to be deleted.
     * @returns {Promise<void>} A promise that resolves when the deletion is complete.
     */
    const deletePost = async (id: number): Promise<void> => {
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



    /**
     * Moves the post at the specified index up by one position in the filteredPosts array.
     * 
     * @param index - The index of the post to move up.
     * 
     * This function creates a copy of the filteredPosts array, swaps the post at the given index
     * with the post immediately before it, updates the post order, and sets the new filteredPosts array.
     */
    const handleMoveUp = (index: number) => {
        const updatedPosts = [...filteredPosts];
        [updatedPosts[index - 1], updatedPosts[index]] = [updatedPosts[index], updatedPosts[index - 1]];
        updatePostOrder(updatedPosts);
        setFilteredPosts(updatedPosts);
    };



    /**
     * Moves the post at the specified index down by one position in the list.
     * 
     * @param index - The index of the post to move down.
     * 
     * This function creates a copy of the `filteredPosts` array, swaps the post at the given index
     * with the post immediately following it, updates the post order, and sets the new order in the state.
     */
    const handleMoveDown = (index: number) => {
        const updatedPosts = [...filteredPosts];
        [updatedPosts[index], updatedPosts[index + 1]] = [updatedPosts[index + 1], updatedPosts[index]];
        updatePostOrder(updatedPosts);
        setFilteredPosts(updatedPosts);
    };



    /**
     * Updates the order of posts by sending a PUT request to the server with the new order.
     *
     * @param {PostItem[]} updatedPosts - An array of posts with their new order.
     * @returns {Promise<void>} A promise that resolves when the post order update is complete.
     *
     * @throws Will set error messages if the update fails or an error occurs during the request.
     */
    const updatePostOrder = async (updatedPosts: PostItem[]): Promise<void> => {
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



    /**
     * Handles the update of a post when the form is submitted.
     *
     * @param {React.FormEvent} e - The form submission event.
     * @returns {Promise<void>} - A promise that resolves when the update is complete.
     *
     * This function performs the following steps:
     * 1. Prevents the default form submission behavior.
     * 2. Sets the `isSubmitting` state to `true` to indicate that the submission is in progress.
     * 3. Determines the new order for the post based on the selected tag.
     * 4. Sends a PUT request to update the post with the new data.
     * 5. Handles the response from the server:
     *    - If the update is successful, sets the success message and refreshes the posts.
     *    - If the update fails, sets the error message.
     * 6. Catches any errors that occur during the update process and logs them to the console.
     * 7. Finally, sets the `isSubmitting` state to `false` to indicate that the submission is complete.
     */
    const handleUpdate = async (e: React.FormEvent): Promise<void> => {
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



    /**
     * Handles the selection of a post.
     *
     * @param {PostItem} post - The post item to be selected.
     * @returns {void}
     */
    const handleSelectPost = (post: PostItem): void => {
        setSelectedPost(post);
        loadSelectedPost(post);
    }



    /**
     * Loads the selected post data into the component's state.
     *
     * @param {PostItem} post - The post item to load.
     * @param {string} post.title - The title of the post.
     * @param {string} post.description - The description of the post.
     * @param {boolean} post.portfolio - Indicates if the post should be included in the portfolio.
     * @param {string} post.type - The type of the post, either 'image' or other.
     * @param {string} post.content - The content of the post, either a comma-separated list of image links or a video string.
     */
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


    
    /**
     * Handles the change of category by updating the new tag with the provided path.
     *
     * @param {PathItem} path - The path item representing the new category.
     * @returns {Promise<void>} A promise that resolves when the category change is handled.
     */
    const handleCateogryChange = async (path: PathItem): Promise<void> => {
        setNewTag(path);
    }



    /**
     * Determines if the form can be submitted based on the validity of its fields.
     *
     * @returns {boolean} True if all fields are valid and the form can be submitted, otherwise false.
     *
     * Validity checks:
     * - Title must be non-empty after trimming.
     * - Paragraph must be non-empty after trimming.
     * - Content must be valid:
     *   - If `imagePost` is true, all images must be valid.
     *   - If `imagePost` is false, `videoString` must be non-empty after trimming.
     * - Categories must be valid:
     *   - If `newTag` is defined, its `path` must be non-empty after trimming.
     */
    const canSubmit = (): boolean => {
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
                    <div>
                        <PathSelector selectedPathMsg="Viewing Posts Tagged As:"
                                      excludeOverriden={true} onSelect={(path) =>
                                      handleTagChange(path)}
                                      selectedPath={tag || { id: -1, path: '', linkOverride: '' }}/>
                    </div>
                </div>
            </div>

            {/* SELECT AND REORDER POSTS */}

            <div className="basis-1/6">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium mb-[10]">
                        Posts Tagged with {tag?.path || "None"}:
                    </label>
                    {reorderPostErrorMessage && <p className="text-red-500">{reorderPostErrorMessage}</p>}
                    {reorderPostSuccessMessage && <p className="text-green-500">{reorderPostSuccessMessage}</p>}    
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
                                    <p className="text-sm text-grey-400">{post.description.length > 100 ? post.description.slice(0,100) + "..." : post.description}</p>
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