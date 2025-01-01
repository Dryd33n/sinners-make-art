import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface ImageStatus {
    status: "loading" | "success" | "error" | "none";
}

type ImageSelectorProps = {
    imageLinks: string[];
    setImageLinks: React.Dispatch<React.SetStateAction<string[]>>;
    setImagesValid: React.Dispatch<React.SetStateAction<boolean>>;
};



/**
 * ImageSelector component allows users to manage a list of image URLs.
 * It provides functionalities to add, remove, and validate image links.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string[]} props.imageLinks - The array of image URLs.
 * @param {Function} props.setImageLinks - The function to update the image URLs.
 * @param {Function} props.setImagesValid - The function to set the validity of the image URLs.
 * 
 * @example
 * return <ImageSelector imageLinks={imageLinks} setImageLinks={setImageLinks} setImagesValid={setImagesValid} />
 * 
 * @returns {JSX.Element} The rendered ImageSelector component.
 */
export default function ImageSelector({ imageLinks, setImageLinks, setImagesValid }: ImageSelectorProps) {
    const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);

    /** Handles the change of an image link input
     * 
     * @param index index of the image link to update
     * @param value link to update the image link with
     */
    const handleImageLinkChange = (index: number, value: string) => {
        const updatedLinks = [...imageLinks];
        updatedLinks[index] = value;
        setImageLinks(updatedLinks);
        checkImageStatus(index, value);
        verifyImageLinks();
    };



    /** Adds a new image link input
     * 
     */
    const handleAddImageLink = () => {
        setImageLinks((prevLinks) => [...prevLinks, ""]);
        setImageStatuses((prevStatuses) => [...prevStatuses, { status: "loading" }]);
        verifyImageLinks();
    };



    /** Removes an image link input
     * 
     * @param index index of the image link to remove
     */
    const handleRemoveImageLink = (index: number) => {
        const updatedLinks = imageLinks.filter((_, i) => i !== index);
        const updatedStatuses = imageStatuses.filter((_, i) => i !== index);
        setImageLinks(updatedLinks);
        setImageStatuses(updatedStatuses);
    };

    /** Checks the status of an image link
     * 
     * @param index index of the image link to check
     * @param url url of the image to check
     * @returns boolean - true if the image is successfully loaded
     */
    const checkImageStatus = useCallback((index: number, url: string) => {
        if (!url)
        {updateImageStatus(index, "none");
            
            return;}

        const image = new window.Image();
        image.src = url;
        image.onload = () => updateImageStatus(index, "success");
        image.onerror = () => updateImageStatus(index, "error");
    }, []);

    /** Updates the status of an image link
     * 
     * @param index index of the image link to update
     * @param status status to update the image link with
     */
    const updateImageStatus = (index: number, status: "loading" | "success" | "error" | "none") => {
        setImageStatuses((prevStatuses) => {
            const updatedStatuses = [...prevStatuses];
            updatedStatuses[index] = { status };
            return updatedStatuses;
        });
    };

    /**
     * Updates the statuses of images by setting them to "loading" initially
     * and then checking the status of each image link.
     *
     * @returns {void}
     */
    const updateImageStatuses = useCallback((): void => {
        const statuses: ImageStatus[] = imageLinks.map(() => ({ status: "loading" }));
        setImageStatuses(statuses);
        imageLinks.forEach((link: string, index: number) => checkImageStatus(index, link));
    }, [imageLinks, checkImageStatus]);

    /**
     * Verifies the status of all image links and sets the validity state.
     * 
     */
    const verifyImageLinks = useCallback((): void => {
        const isValid = imageStatuses.every((status) => status.status === "success");
        setImagesValid(isValid);
    }, [imageStatuses, setImagesValid]);

    useEffect(() => {
        updateImageStatuses();
    }, [imageLinks, updateImageStatuses]);

    useEffect(() => {
        verifyImageLinks();
    }, [imageStatuses, verifyImageLinks]);

    return (<>
        <div className="bg-grey-700 p-2 rounded-md">
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
                    {imageStatuses[index]?.status === "loading" &&
                        <div className="w-16 h-16 ml-2 rounded grid place-content-center place-items-center border">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-4 border-t-gray-800 rounded-full animate-spin"></div>
                        </div>

                    }
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
                        <div className="w-16 h-16 ml-2 rounded border flex items-center justify-center border-red-500">
                            <p className="text-red-500 font-bold text-center">Bad Link</p>
                        </div>
                    )}
                    {imageStatuses[index]?.status === "none" && (
                        <div className="w-16 h-16 ml-2 rounded border flex items-center justify-center border-red-500">
                            <p className="text-white font-bold text-center">Enter Link</p>
                        </div>
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
        </div>
    </>)
}