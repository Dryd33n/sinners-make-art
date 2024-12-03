export default function Header(){
    return (
        <header className="relative w-full h-64">
            <img 
            src="/header-bg.webp" 
            alt="Wire Sculpture Background Image"
            className="absolute inset-0 w-full h-full object-cover" />
        
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-extralight tracking-widest">
                MARY-JANE LARONDE
                </h1>
            </div>
        
        </header>

        
    )
}