"use client"; // Add this at the top

import React, { useState } from "react";

const AboutMeForm = () => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleParagraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParagraph(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, text: paragraph }),
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
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">About Me Section</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter the title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="aboutMe" className="block text-sm font-medium mb-2">
            About Me
          </label>
          <textarea
            id="aboutMe"
            value={paragraph}
            onChange={handleParagraphChange}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Write about yourself"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default AboutMeForm;
