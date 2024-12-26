'use client';

import React, { useState, useEffect } from 'react';
import NavBar from './components/navBar';
import Header from './components/header';
import AboutSection from './components/about_section';
import Footer from './components/footer';

const Home = () => {
  return (
    <>
      <Header mainText="MARY-JANE LARONDE" />
      <NavBar />

      <AboutSection />
      <Footer/>
    </>
  );


};

export default Home;