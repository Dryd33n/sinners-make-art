'use client'
import { useState, useEffect } from "react";
import PathSelector from "./shared/path_selector";
import { PostItem } from "@/db/schema";

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
}


export default function Portfolio(): JSX.Element {

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

    // PORTFOLIO POSTS
    const [portfolioPosts, setPortfolioPosts] = useState<PostItem[]>([]);

    /* FORM VARS */
    const [title, setTitle] = useState("");
    const [paragraph, setParagraph] = useState("");
    const [imagePost, setImagePost] = useState(true);
    const [allImagesValid, setAllImagesValid] = useState(false);
    const [includeInPortfolio, setIncludeInPortfolio] = useState(false);
    const [newTag, setNewTag] = useState<PathItem>();
    /* CONTENT VARS */




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
                console.log("All posts: ", result.data);

                setReorderPostErrorMessage('')
                setReorderPostSuccessMessage('All posts successfully loaded');

                fetchPortfolio(result.data);
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
    useEffect(() => { fetchPosts();}, []);



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

    const addPostToPortfolio = async (index: number): Promise<void> => {
        const newPortfolioPosts = [...portfolioPosts, filteredPosts[index]];
        console.log("Adding post: ", filteredPosts[index]);
        setPortfolioPosts(newPortfolioPosts);
    }

    const removePostFromPortfolio = async (index: number): Promise<void> => {
        const newPortfolioPosts = portfolioPosts.filter((_, i) => i !== index);
        setPortfolioPosts(newPortfolioPosts);
    }

    const reOrderPost = async (index: number, direction: 'up' | 'down'): Promise<void> => {
        const newPortfolioPosts = [...portfolioPosts];
        const [movedPost] = newPortfolioPosts.splice(index, 1);
        if (direction === 'up') {
            newPortfolioPosts.splice(index - 1, 0, movedPost);
        } else {
            newPortfolioPosts.splice(index + 1, 0, movedPost);
        }
        setPortfolioPosts(newPortfolioPosts);
    }

    const postPortfolio = async (): Promise<void> => {
        // strip from portfolioPosts all but id, and get order from index
        const posts = portfolioPosts.map((post, index) => ({ post_id: post.id, order: index }));
        console.log("Posting portfolio: ", posts);

        try {
            const response = await fetch('/api/manage_portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ posts }),
            });

            const result = await response.json();

            if (result.success) {
                setReorderPostErrorMessage('');
                setReorderPostSuccessMessage('Portfolio successfully updated');
            } else {
                setReorderPostSuccessMessage('');
                setReorderPostErrorMessage('Failed to update portfolio');
            }
        } catch (error) {
            console.error('Error posting portfolio:', error);
            setReorderPostSuccessMessage('');
            setReorderPostErrorMessage('Error posting portfolio');
        }
    }

    const fetchPortfolio = async (posts): Promise<void> => {
        try {
            const response = await fetch('/api/manage_portfolio');
            const result = await response.json();

            if (result.success) {
                // find posts with id equal to post_id in result.data
                console.log("result: ", result.data);

                //create an array of post id's in result.data
                const postIds = result.data.map((post: { post_id: number }) => post.post_id);
                console.log("postIds: ", postIds);

                console.log("All posts from portfolio fetch: ", posts);

                // create a new array based of allPosts that have an id in postIds
                const portfolioPosts = posts.filter((post) => postIds.includes(post.id));

                console.log("Portfolio posts: ", portfolioPosts);

                setPortfolioPosts(portfolioPosts);
                setReorderPostErrorMessage('');
                setReorderPostSuccessMessage('Portfolio successfully loaded');
            } else {
                console.error('Failed to fetch portfolio');
                setReorderPostSuccessMessage('');
                setReorderPostErrorMessage('Failed to fetch portfolio');
            }
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setReorderPostSuccessMessage('');
            setReorderPostErrorMessage('Error fetching portfolio');
        }
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
                        selectedPath={tag || { id: -1, path: '', linkOverride: '' }} />
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
                                    className={`flex flex-col p-2 mb-2 border-b border-grey-600 cursor-pointer 
                                            ${selectedPost?.id === post.id ? "bg-blue-700" : "bg-grey-700"}
                                        `}
                                >
                                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                                    <p className="text-sm text-grey-400">{post.description.length > 100 ? post.description.substring(0,97)+"..." : post.description}</p>
                                    <span className="text-sm text-grey-500">Type: {post.type}</span>

                                    {/* Action Buttons */}
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => addPostToPortfolio(index)}
                                            className="px-4 py-1 text-sm w-full bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Add to portfolio
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


            {/* Manage */}
            <div className="basis-4/6">
                <label htmlFor="title" className="block text-lg font-medium mb-4 ">
                    Portfolio Posts:
                </label>
                {/* Map portfolio posts as list */}
                <div className="h-[500] overflow-y-auto bg-grey-700 rounded-md p-2">
                    {portfolioPosts.length > 0 ? (
                        portfolioPosts.map((post, index) => (
                            <div className="flex flex-row justify-between gap-3 w-full" key={post.id}>
                                {/* Post Content */}
                                <div
                                    className={`flex flex-col flex-grow p-2 mb-2 border-b border-grey-600 cursor-pointer
                        bg-grey-700}
                    `}
                                >
                                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                                    <p className="text-sm text-grey-400">{post.description.length > 100 ? post.description.substring(0,97)+"..." : post.description}</p>
                                    <span className="text-sm text-grey-500">Type: {post.type}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-row gap-1 min-w-32 p-2 flex-shrink-0">
                                    <div className="flex flex-col gap-1 min-w-16">
                                        <button
                                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                            disabled={index === 0}
                                            onClick={() => reOrderPost(index, 'up')}
                                        >↑</button>
                                        <button
                                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                            disabled={index === portfolioPosts.length - 1}
                                            onClick={() => reOrderPost(index, 'down')}
                                        >↓</button>
                                    </div>
                                    <button
                                        className="p-1 min-w-16 bg-red-500 text-white rounded hover:bg-red-800"
                                        onClick={() => removePostFromPortfolio(index)}
                                    >
                                        ✖
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-grey-500">No posts available for this tag.</p>
                    )}
                </div>
                <button className="px-4 py-1 text-sm w-full bg-green-600 text-white rounded-md hover:bg-green-700 mt-2"
                onClick={postPortfolio}>Update Portfolio</button>
                {reorderPostErrorMessage && <p className="text-red-500">{reorderPostErrorMessage}</p>}
                {reorderPostSuccessMessage && <p className="text-green-500">{reorderPostSuccessMessage}</p>}
            </div>

        </div>
    </>)
}
