'use client';

import NavBar from './components/navBar';
import Header from './components/header';
import AboutSection from './components/about_section';
import Footer from './components/footer';


type Post = {
  id: number;
  title: string;
  description: string;
  type: string;
  content: string;
  tag: string;
  order: number;
  portfolio: boolean;
};


type NavLink = {
  id: number;
  name: string;
  path: string;
  link_ovveride: string;
  order: number;
}


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