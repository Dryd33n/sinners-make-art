interface MenuItem {
    text: string;
    link: string;
}

interface NavButtonProps {
    text: string;
    link: string;
    links: LinkItem[];
}

const NavButton: React.FC<NavButtonProps> = ({ text, link, links }) => {
    return (
      <div className="relative group inline-block w-full">
        {/* Main Button */}
        <a
          href={link}
          className="flex items-center px-4 py-2 bg-grey-900 text-white group-hover:bg-grey-700 w-full h-14 border-r  border-white"
        >
            <div className="m-auto">
                <span className="font-extralight tracking-wider">{text}</span>
            </div>

        </a>
  
        {/* Dropdown Menu */}
        <ul className="absolute hidden group-hover:block bg-grey-800 shadow-lg w-full">
          {links.map((menuItem, index) => (
            <li key={index} className="hover:bg-grey-600">
              <a
                href={menuItem.link}
                className="block px-4 py-2 text-gray-200 font-light text-sm tracking-wide hover:text-white"
              >
                {menuItem.text.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default NavButton;