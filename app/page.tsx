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
      {/* <nav className="w-full flex">
      <NavButton text="SCULPTURE" link="/account" links={sculpture_links} />
      <NavButton text="PHOTO" link="/account" links={sculpture_links} />
      <NavButton text="VIDEO" link="/account" links={sculpture_links} />
      <NavButton text="PAINT" link="/account" links={sculpture_links} />
      <NavButton text="OTHER" link="/account" links={sculpture_links} />
      </nav> */}

      <AboutSection/>
   
    </main>
    </>
  )
}
