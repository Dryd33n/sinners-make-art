import Link from "next/link";
import { FaHome } from "react-icons/fa";

/** Renders a home icon in the bottom left which redirects the user to the home page.
 * 
 * @returns React Component
 */
export default function HomeButton() {
  return (
<div style={{ position: 'fixed', bottom: 0, left: 0, margin: '10px', zIndex: 1000 }}>
  <Link href="/">
  <FaHome size={30}/>
  </Link>

</div>
  );
}