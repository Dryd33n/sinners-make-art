import Header from "./components/header";
import NavButton from "./components/navButton";

export default function Home() {
  const submenuLinks = [
    { text: "Profile", link: "/profile" },
    { text: "Settings", link: "/settings" },
    { text: "Logout", link: "/logout" },
  ];

  return (<>
    <Header />
    <main>
      <nav className="w-full flex">
      <NavButton text="METALWORK" link="/account" links={submenuLinks} />
      <NavButton text="SCULPTURE" link="/account" links={submenuLinks} />
      <NavButton text="PHOTO" link="/account" links={submenuLinks} />
      <NavButton text="VIDEO" link="/account" links={submenuLinks} />        
      </nav>
    </main>
    </>
  )
}
