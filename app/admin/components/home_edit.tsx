"use client";

import React, { useState } from "react";
import Image from 'next/image';
import Tooltip from "@/app/admin/components/shared/tooltip";

interface ImageStatus {
  status: "loading" | "success" | "error";
}

/**The about me form allows for editing which content appears on the home page about me section
 * 
 * @returns react component
 */
const AboutMeForm = () => {
  // Form Content
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [imageLinks, setImageLinks] = useState<string[]>([""]);

  // Form States
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error & Success Messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");



  /**CAN SUBMIT
   * Checks to make sure all parts of the form are filled out properly before allowing the user to submit the form
   * 
   * @returns boolean if form has valid components or not
   */
  const canSubmit = () => {
    const hasValidTitle = title.trim() !== "";
    const hasValidParagraph = paragraph.trim() !== "";
    const hasAtLeastOneImage = imageLinks.length > 0 && imageLinks.some((link) => link.trim() !== "");
    const allImagesValid = imageStatuses.every((status) => status.status === "success");
    return hasValidTitle && hasValidParagraph && hasAtLeastOneImage && allImagesValid;
  };



  /** CHANGE IMAGE LINK
   * modifies the list of current image links with changed value then checks image status to load preview
   * 
   * @param index index of image link to modify
   * @param value new link to image
   */
  const handleImageLinkChange = (index: number, value: string) => {
    const updatedLinks = [...imageLinks];
    updatedLinks[index] = value;
    setImageLinks(updatedLinks);
    checkImageStatus(index, value);
  };



  /** ADD IMAGE LINK
   * Adds an empty string to current list of images and set loading status for no image
   * 
   */
  const handleAddImageLink = () => {
    setImageLinks((prevLinks) => [...prevLinks, ""]);
    setImageStatuses((prevStatuses) => [...prevStatuses, { status: "loading" }]);
  };



  /** REMOVE IMAGE LINK
   * Updates image link array by removing a specific link and update status array to remove status for removed image
   * 
   * @param index index of image to be removed
   */
  const handleRemoveImageLink = (index: number) => {
    const updatedLinks = imageLinks.filter((_, i) => i !== index);
    const updatedStatuses = imageStatuses.filter((_, i) => i !== index);
    setImageLinks(updatedLinks);
    setImageStatuses(updatedStatuses);
  };



  /**CHECK IMAGE STATUS
   * Check status of image link by attempting to load it and see if it returns a valid images
   * 
   * @param index index of image to check
   * @param url url of image to check
   * @returns returns nothing
   */
  const checkImageStatus = (index: number, url: string) => {
    if (!url) return;

    const image = new window.Image();
    image.src = url;
    image.onload = () => updateImageStatus(index, "success");
    image.onerror = () => updateImageStatus(index, "error");
  };

  

  /**UPDATE IMAGE STATUS
   * Updates one entry in the image status array
   */
  const updateImageStatus = (index: number, status: "loading" | "success" | "error") => {
    setImageStatuses((prevStatuses) => {
      const updatedStatuses = [...prevStatuses];
      updatedStatuses[index] = { status };
      return updatedStatuses;
    });
  };



  /**FETCH HOME FORM DATA
   * Fetches home data from db and populates the form with the current information from the db
   * 
   * ROUTE: /api/about_me/route.tsx
   */
  const fetchHomeData = async () => {
    // Clear success & error messages
    setSuccessMessage("");
    setErrorMessage("");  

    // Try to fetch from api 
    try {
      const response = await fetch("/api/about_me");

      if (!response.ok) {
        throw new Error("Failed to load current home data");
      }

      const result = await response.json();

      if (result.success && result.response.length > 0) {
        // homeTable only has one row so get first row containing all data
        const data = result.response[0];

        // set title and body info
        setTitle(data.about_title || "");
        setParagraph(data.about_text || "");

        //split images and set image links
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



  /**POST HOME FORM DATA 
   * Makes a post api request to upload form data to db to be used to populate the about me section
   * 
   * @param e React form event
   */
  const postHomeData = async (e: React.FormEvent) => {
    //prevent page reload
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      //Convert image links to csv
      const csvString = imageLinks.filter((link) => link.trim() !== "").join(",");

      //API post method
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,             // about me title
          text: paragraph,   // about me text
          images: csvString, // csv of image linkes
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Data saved successfully");
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
      <div className="p-4 max-w-4xl mx-auto bg-grey-850 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About Me Section</h2>

        <form onSubmit={postHomeData} className="flex flex-col md:flex-row gap-6">
          {/* Left Side */}
          <div className="flex-1">
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-lg font-medium mb-4">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Enter the title"
              />
            </div>

            {/* Paragraph */}
            <div className="mb-4">
              <label htmlFor="aboutMe" className="block text-lg font-medium mb-4">
                About Me
              </label>
              <textarea
                id="aboutMe"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Write about yourself"
              />
            </div>

            {/* Buttons */}
            <div>
              <button
                type="button"
                onClick={fetchHomeData}
                className="mb-4 mr-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Load Current Data
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                disabled={isSubmitting || !canSubmit()}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            <div className="flex flex-row">
              <Tooltip>
                <p>
                  While varying image sizes are supported, I.E landscape and portrait, it is best to use images with all the same size due to how the images are displayed on mobile.
                </p>
              </Tooltip>
              <h3 className="text-lg font-medium mb-4">Image Links</h3>
            </div>

            {/* Images Display */}
            {imageLinks.map((link, index) => (
              <div key={index} className="mb-4 flex items-center">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleImageLinkChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded mr-2 text-black"
                  placeholder="Enter image URL"
                />
                {/* Remove Image Button */}
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

            {/* Add Image Button */}
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
        </form>

        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AboutMeForm;
