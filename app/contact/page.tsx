'use client'

import Header from "../components/header";
import NavBar from "../components/navBar";
import { useState } from 'react';


export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic form validation
    if (formValid) {
      setError('All fields are required');
      return;
    }

    // Clear any previous errors
    setError('');
    setSuccess('');

    const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message }),
      });
    
      const data = await response.json();
      if (data.success) {
        setSuccess("Email sent successfully!");
      } else {
        setError(`Error: ${data.error}`);
      }
  };

const formValid = !email || !subject || !message;

  return (
    <>
      <Header mainText="CONTACT ME" />
      <NavBar />
      <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4">
              <div className="mb-4 flex-1">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
              <div className="mb-4 flex-1">
                <label htmlFor="subject" className="block text-sm font-medium ">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="Hello! I want..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
                  required
                />
              </div>
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium ">Message</label>
            <textarea
              id="message"
              value={message}
              placeholder="Your message here..."
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
              rows={4}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-20"
          disabled={formValid}>Send Message</button>
        </form>
      </div>
    </>
  );
}