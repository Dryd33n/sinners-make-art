import Image from 'next/image';

interface HeaderProps {
  mainText: string;
}

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

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-extralight tracking-widest text-center">
          {mainText}
        </h1>
      </div>
    </header>
  );
}