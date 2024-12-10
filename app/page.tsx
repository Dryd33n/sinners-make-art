import Header from "./components/header";
import NavButton from "./components/navButton";
import AboutSection from "./components/about_section";
import { MenuLink } from "./components/navButton";
import { getDBVersion } from "@/db";
import NavBar from "./components/navBar";

export default async function Home() {
    const { version } = await getDBVersion();
    console.log({version})

  

  return (<>
    <Header mainText="MARY-JANE LARONDE"/>

    <NavBar/>
    <main>
      <AboutSection/> 
    </main>
    </>
  )
}
