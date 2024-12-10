"use client";

import React, { useState } from "react";

interface ImageStatus {
  status: "loading" | "success" | "error";
}

const AboutMeForm = () => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [imageLinks, setImageLinks] = useState<string[]>([""]);
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([{ status: "loading" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate whether the form can be submitted
  const canSubmit = () => {
    const hasValidTitle = title.trim() !== "";
    const hasValidParagraph = paragraph.trim() !== "";
    const hasAtLeastOneImage = imageLinks.length > 0 && imageLinks.some((link) => link.trim() !== "");
    const allImagesValid = imageStatuses.every((status) => status.status === "success");
    return hasValidTitle && hasValidParagraph && hasAtLeastOneImage && allImagesValid;
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

    const image = new Image();
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

    try {
      const csvString = imageLinks.filter((link) => link.trim() !== "").join(",");
      console.log("CSV Image Links:", csvString);

      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          text: paragraph,
          images: csvString,
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

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
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
                onChange={handleTitleChange}
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
                onChange={handleParagraphChange}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Write about yourself"
              />
            </div>

            {/* Buttons */}
            <div>
              <button
                type="button"
                onClick={handleLoadData}
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
                  <img
                    src={link}
                    alt={`Preview ${index}`}
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
          </div>
        </form>

        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AboutMeForm;
