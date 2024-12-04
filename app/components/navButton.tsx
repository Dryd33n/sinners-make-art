interface MenuItem {
  text: string;
  link: string;
}

export type MenuLink = MenuItem | { [category: string]: MenuItem[] };

interface NavButtonProps {
  text: string;
  link: string;
  links: MenuLink[];
}

const NavButton: React.FC<NavButtonProps> = ({ text, link, links }) => {
  return (
    <div className="relative group inline-block w-full">
      {/* Main Button */}
      <a
        href={link}
        className="flex items-center px-4 py-2 bg-grey-900 text-white group-hover:bg-grey-700 w-full h-14 border-r border-white"
      >
        <div className="m-auto">
          <span className="font-extralight tracking-wider">{text}</span>
        </div>
      </a>

      {/* Dropdown Menu */}
      <ul className="absolute hidden group-hover:block bg-grey-800 shadow-lg w-full">
        {links.map((item, index) => {
          if ("text" in item && "link" in item) {
            // Simple MenuItem

            return (
              <li key={index} className="hover:bg-grey-600">
                <a
                  href={String(item.link)}
                  className="block px-4 py-2 text-grey-200 font-light text-sm tracking-wide hover:text-white"
                >
                  {String(item.text).toUpperCase()}
                </a>
              </li>
            );
          } else {
            // Category with Subcategories
            const categoryName = Object.keys(item)[0];
            const subItems = item[categoryName];

            return (
              <li key={index} className="bg-grey-800">
                <div className="px-4 py-2 text-grey-300 font-extralight text-sm tracking-wide hover:bg-grey-600">
                  {categoryName.toUpperCase()}
                </div>
                <ul>
                  {subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="hover:bg-grey-800">
                      <a
                        href={subItem.link}
                        className="block px-10 py-2 text-grey-300 font-light text-sm tracking-wide hover:text-white hover:bg-grey-600"
                      >
                        {subItem.text.toUpperCase()}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default NavButton;
