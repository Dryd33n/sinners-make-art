import NavBar from './components/navBar';
import Header from './components/header';
import AboutSection from './components/about_section';
import Footer from './components/footer';

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