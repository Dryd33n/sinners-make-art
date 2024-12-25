'use client';

import React, { useState, useEffect } from 'react';
import NavBar from './components/navBar';
import MobileNavBar from './components/mobileNavBar';
import Header from './components/header';
import AboutSection from './components/about_section';
import Footer from './components/footer';

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const socialLinks = [{ name: 'Twitter', url: 'https://twitter.com' }, 
                       { name: 'Facebook', url: 'https://facebook.com' },
                       { name: 'Instagram', url: 'https://instagram.com' }];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the width threshold as needed
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
      <Header mainText="MARY-JANE LARONDE" />
      <div>
        {isMobile ? <MobileNavBar /> : <NavBar />}

      </div>

      <AboutSection />
      <Footer/>
    </>
  );


};

export default Home;