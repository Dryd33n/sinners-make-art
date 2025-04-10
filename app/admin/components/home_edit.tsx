"use client";

import React, { useState } from "react";
import Tooltip from "@/app/admin/components/shared/tooltip";
import ImageSelector from "./shared/image_selector";

/**
 * AboutMeForm Component
 * 
 * This component renders a form for editing the "About Me" section. It allows users to load current data from the database,
 * edit the title, paragraph, and image links, and submit the updated data back to the database.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered AboutMeForm component.
 * 
 * @example
 * <AboutMeForm />
 * 
 * @remarks
 * - The form includes input fields for the title, paragraph, and image links.
 * - The form validates the input fields before allowing submission.
 * - The form displays success and error messages based on the result of the data fetch and submission.

 */
const AboutMeForm = () => {
  // Form Content
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [secondTitle, setSecondTitle] = useState("");
  const [secondParagraph, setSecondParagraph] = useState("");
  const [imageLinks, setImageLinks] = useState<string[]>([""]);
  const [imagesValid, setImagesValid] = useState<boolean>(false);


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
    const hasValidSecondTitle = secondTitle.trim() !== "";
    const hasValidSecondParagraph = secondParagraph.trim() !== "";
    const hasAtLeastOneImage = imageLinks.length > 0 && imageLinks.some((link) => link.trim() !== "");
    return hasValidTitle && hasValidParagraph && hasAtLeastOneImage && imagesValid && hasValidSecondTitle && hasValidSecondParagraph;
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

        setSecondTitle(data.second_title || "");
        setSecondParagraph(data.second_text || "");

        //split images and set image links
        const links = data.about_images ? data.about_images.split(",").map((url: string) => url.trim()) : [""];
        setImageLinks(links);

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
          secondTitle: secondTitle, // second title',
          secondText: secondParagraph, // second text
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Data saved successfully");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        console.log("WHAT THE FUCKKKKKKKKKKKKKKKKKKKs")
        console.log("uploading date: \n title: " + title + "\n paragraph: " + paragraph + "\n images: " + imageLinks + "\n second title: " + secondTitle + "\n second paragraph: " + secondParagraph);
    
    
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later." + error);
      console.log("WHAT THE FUCKKKKKKKKKKKKKKKKKKKs")
      console.log("uploading date: \n title: " + title + "\n paragraph: " + paragraph + "\n images: " + imageLinks + "\n second title: " + secondTitle + "\n second paragraph: " + secondParagraph);
  
  
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="p-4 max-w-4xl mx-auto bg-grey-850 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About Me Section</h2>

        <form onSubmit={postHomeData} className="">
          <div className="flex flex-col md:flex-row gap-6">
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
              <ImageSelector imageLinks={imageLinks} setImageLinks={setImageLinks} setImagesValid={setImagesValid}/>
            </div>
          </div>

          {/* Bottom Buttons */}
          {/* Title */}
          <div className="mb-4">
              <label htmlFor="title" className="block text-lg font-medium mb-4">
                Second Title
              </label>
              <input
                type="text"
                id="title"
                value={secondTitle}
                onChange={(e) => setSecondTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="Enter the title"
              />
            </div>

            {/* Paragraph */}
            <div className="mb-4">
              <label htmlFor="aboutMe" className="block text-lg font-medium mb-4">
                Second Text
              </label>
              <textarea
                id="aboutMe"
                value={secondParagraph}
                onChange={(e) => setSecondParagraph(e.target.value)}
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

        </form>

        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AboutMeForm;
