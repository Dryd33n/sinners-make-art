import Header from "./components/header";
import NavButton from "./components/navButton";
import AboutMe from "./components/about_me";
import AboutSection from "./components/about_section";
import { MenuLink } from "./components/navButton";
import { getDBVersion } from "@/db";

export default async function Home() {
  const sculpture_links: MenuLink[] = [
    { "Metalwork": [
      { text: "Wire", link: "/cat1/sub1" }, 
      { text: "Welding & Plasma Cutting", link: "/cat1/sub2" }] },

    { text: "Woodwork", link: "/about" },];

    const { version } = await getDBVersion();
    console.log({version})

  

  return (<>
    <Header />
    <main>
      <nav className="w-full flex">
      <NavButton text="SCULPTURE" link="/account" links={sculpture_links} />
      <NavButton text="PHOTO" link="/account" links={sculpture_links} />
      <NavButton text="VIDEO" link="/account" links={sculpture_links} />
      <NavButton text="PAINT" link="/account" links={sculpture_links} />
      <NavButton text="OTHER" link="/account" links={sculpture_links} />
      </nav>

      <AboutSection />
    </main>
    </>
  )
}
