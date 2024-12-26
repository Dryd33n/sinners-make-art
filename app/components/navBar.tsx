'use client';

import { useEffect, useState } from "react";
import { buildTree } from "../utils/admin/navtree/utils";
import NavButton, { MenuItem, MenuLink } from "./navButton";
import { Node } from "../admin/components/nav_tree";
import Image from 'next/image';
import MobileNavBar from "./mobileNavBar";

export default function NavBar() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the width threshold as needed
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (<>
        {isMobile ? (<MobileNavBar />) : (<WebNavBar />)}
    </>
    )
}

function WebNavBar() {
    const [navTree, setNavTree] = useState<Node[]>([]);

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
            let link = node.link_override === 'auto' ? `/${url_path.toLowerCase()}/${node.name.toLowerCase().replace(/ /g, '-')}` : node.link_override;
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
        <>
            <nav className="w-full flex z-20 relative">
                {navTree.map((treeItem) => {
                    const links = buildMenuLinks(treeItem.children || [], treeItem.name);
                    return (
                        <NavButton
                            key={treeItem.id}
                            text={treeItem.name}
                            link={`/${treeItem.name.toLowerCase().replace(/ /g, '-')}`}
                            links={links}
                        />
                    );
                })}
            </nav>
            <div className="relative max-h-52 min-h-52 overflow-hidden w-full">
                {/* Background Image */}
                <Image
                    src="/header-bg.webp"
                    alt="Header Background"
                    width="1920"
                    height="1080"
                    priority
                    className="absolute inset-0 w-full h-full object-cover -z-10 scale-x-[-1] blur-[2px]"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0abf] from-10% via-[#0a0a0a] via-50% to-[#0a0a0a] to-100% z-10"></div>
            </div>
        </>
    );
}
