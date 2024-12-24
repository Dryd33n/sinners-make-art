'use client';
import Tooltip from "@/app/components/tooltip";
import { useEffect, useState } from "react";

interface PathItem {
    id: number;
    path: string;
    linkOverride: string;
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
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [categorySuccessMessage, setCategorySuccessMessage] = useState("");
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");

    const [reorderPostSuccessMessage, setReorderPostSuccessMessage] = useState("");
    const [reorderPostErrorMessage, setReorderPostErrorMessage] = useState("");

    {/* POST TAGS */ }
    const [allPaths, setAllPaths] = useState<PathItem[]>([]); // All available paths
    const [tag, setTag] = useState<PathItem>();

    {/* POSTS */ }
    const [allPosts, setAllPosts] = useState<PostItem[]>([]); // All available posts
    const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([]); // Posts filtered by tag
    const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const result = await response.json();

            if (result.success) {
                setAllPosts(result.data);
                console.log('Posts:', result.data);
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
                console.log('Post deleted successfully:', result.message);
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

    


    return (<>
        <div className="flex flex-row">
            {/* SELECT CATEGORY */}
            <div>
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
                    <div className="h-64 overflow-y-auto bg-grey-700 rounded-md p-2">
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
            <div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-lg font-medium mb-4">
                        Posts Tagged with {tag?.path || "None"}:
                    </label>
                    <div className="h-64 overflow-y-auto bg-grey-700 rounded-md p-2">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <div
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
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
                    </div>
                </div>  
                {reorderPostErrorMessage && <p className="text-red-500">{reorderPostErrorMessage}</p>}
                {reorderPostSuccessMessage && <p className="text-green-500">{reorderPostSuccessMessage}</p>}
            </div>


            {/* EDIT POST TITLE, DESCRIPTION & CATEGORY */}
            <div>

            </div>

            {/* EDIT POST CONTENT */}
            <div>

            </div>
        </div>
    </>)
}