import NavBar from './components/global/navBar';
import Header from './components/global/header';
import AboutSection from './components/about_section';
import Footer from './components/global/footer';

export const metadata = {
  title: "Sinners Make Art",
  description: "Mary-Jane Laronde's personal website",
};



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