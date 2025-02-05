'use client'

import React, { useState, useEffect } from 'react';
import { SocialLink } from '@/db/schema';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/social_links',{
          next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setSocialLinks(data.data); // Set the fetched links
        } else {
          console.error('Error fetching links:', data.error);
        }
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="text-center p-4 font-light bg-grey-850 mt-10 text-white w-full">
      <p className='text-grey-200'>&copy; {new Date().getFullYear()} Sinners Make Art. All rights reserved.</p>
      <p className='italic text-grey-200'>Thank you for visiting!</p>
      <div className="mt-5 mb-3 flex flex-col">
        <button onClick={scrollToTop}>
          <p className=" underline mx-2 text-white hover:text-gray-400 my-3">Back To Top</p>
        </button>

        <div>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} className=" underline mx-2 text-white hover:text-gray-400" target="_blank" rel="noopener noreferrer">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;