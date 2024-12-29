import Image from "next/image";
import Link from "next/link";

export default function HomeButton() {
  return (
<div style={{ position: 'fixed', bottom: 0, left: 0, margin: '10px' }}>
  <Link href="/">
  <Image src="/home.png" alt="Home" width={30} height={30}>
  </Image>  
  </Link>

</div>
  );
}