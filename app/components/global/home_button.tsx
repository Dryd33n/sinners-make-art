import Image from "next/image";
import Link from "next/link";

/** Renders a home icon in the bottom left which redirects the user to the home page.
 * 
 * @returns React Component
 */
export default function HomeButton() {
  return (
<div style={{ position: 'fixed', bottom: 0, left: 0, margin: '10px', zIndex: 1000 }}>
  <Link href="/">
  <Image src="/home.png" alt="Home" width={30} height={30}>
  </Image>  
  </Link>

</div>
  );
}