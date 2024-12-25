'use client';

import { useEffect, useState } from "react";
import { buildTree } from "../utils/admin/navtree/utils";
import NavButton, { MenuItem, MenuLink } from "./navButton";
import { Node } from "../admin/components/nav_tree";
import Image from 'next/image';
import { HiMenu, HiX } from "react-icons/hi";

export default function MobileNavBar() {
    const [navTree, setNavTree] = useState<Node[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch tree data from API
    useEffect(() => {
        const fetchTreeData = async () => {
            try {
                const response = await fetch('/api/admin/navtree');
                const result = await response.json();

                if (result.success) {
                    const data = result.data;
                    const tree = buildTree(data);
                    setNavTree(tree);
                } else {
                    console.error('Failed to load navigation tree');
                }
            } catch (error) {
                console.error('Error loading navigation tree:', error);
            }
        };

        fetchTreeData();
    }, []);

    // Recursive function to convert tree nodes into MenuLinks
    const buildMenuLinks = (nodes: Node[], url_path: string): MenuLink[] => {
        return nodes.map((node) => {
            let link = node.link_override === 'auto' 
                ? `/${url_path.toLowerCase()}/${node.name.toLowerCase().replace(/ /g, '-')}` 
                : node.link_override;

            if (node.children && node.children.length > 0) {
                return {
                    [node.name]: {
                        categoryItem: {
                            text: node.name,
                            link: link,
                        },
                        subItems: buildMenuLinks(node.children, `${url_path}/${node.name.toLowerCase().replace(/ /g, '-')}`),
                    }
                } as MenuLink;
            } else {
                return {
                    text: node.name,
                    link: link,
                } as MenuItem;
            }
        });
    };

    return (
        <nav className="w-full bg-grey-850 mb-2 text-white relative">
            {/* Header with menu toggle */}
            <div className="flex items-center justify-between px-4 py-3"
                 onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="text-xl font-extralight">MENU</div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-2xl focus:outline-none"
                >
                    {isMenuOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            {/* Collapsible Menu */}
            <div className={`${isMenuOpen ? "block" : "hidden"} px-4 pb-4`}>
                {navTree.map((treeItem) => {
                    const links = buildMenuLinks(treeItem.children || [], treeItem.name);
                    return (
                        <MobileNavButton
                            key={treeItem.id}
                            text={treeItem.name}
                            link={`/${treeItem.name.toLowerCase().replace(/ /g, '-')}`}
                            links={links}
                        />
                    );
                })}
            </div>
        </nav>
    );
}

interface MobileNavButtonProps {
    text: string;
    link: string;
    links: MenuLink[];
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ text, link, links }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-2">
            {/* Main Menu Item */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full px-4 py-2 bg-grey-800 text-left hover:bg-grey-700"
            >
                <span>{text.toUpperCase()}</span>
                <span>{isOpen ? "-" : "+"}</span>
            </button>

            {/* Submenu */}
            {isOpen && (
                <ul className="mt-2 pl-4 border-l border-grey-700">
                    {links.map((item, index) => {
                        if ("text" in item && "link" in item) {
                            // Simple MenuItem
                            return (
                                <li key={index}>
                                    <a
                                        href={String(item.link)}
                                        className="block px-4 py-2 text-grey-200 hover:text-white hover:bg-grey-600"
                                    >
                                        {String(item.text).toUpperCase()}
                                    </a>
                                </li>
                            );
                        } else {
                            // Category with Subcategories
                            const categoryName = Object.keys(item)[0];
                            const categoryItem = item[categoryName].categoryItem;
                            const subItems = item[categoryName].subItems;

                            return (
                                <li key={index} className="mb-2">
                                    <span className="block px-4 py-2 text-grey-200 font-light">
                                        {categoryName.toUpperCase()}
                                    </span>
                                    <ul className="pl-4">
                                        {subItems.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <a
                                                    href={subItem.link}
                                                    className="block px-4 py-2 text-grey-200 hover:text-white hover:bg-grey-600"
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
            )}
        </div>
    );
};

