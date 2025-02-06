import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  mainText: string;
}

/** Displays a header with text supplied by props
 * 
 * @param mainText: text to display on header
 * @returns React Component
 */
export default function Header({ mainText }: HeaderProps) {
  return (
    <header className="relative w-full h-64">
      <Image
        src="/header-bg.webp"
        alt="Wire Sculpture Background Image"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />

      <div className="absolute inset-0 flex flex-col justify-center gap-0">
        <div className='-translate-y-2'>
        <Link href='/'>
          <p className='tracking-widest font-extralight text-center text-white text-xl my-1 italic '>SINNERS MAKE ART</p>
        </Link>
          <h1 className="text-white my-0 lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-extralight tracking-widest text-center">
            {mainText}
          </h1>
        </div>
      </div>
    </header>
  );
}