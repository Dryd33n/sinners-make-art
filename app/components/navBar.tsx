'use client';

import { useEffect, useState } from "react";
import { buildTree } from "../utils/admin/navtree/utils";
import NavButton, { MenuItem, MenuLink } from "./navButton";
import { Node } from "../admin/components/nav_tree";

export default function NavBar() {
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
                    console.log("Nav Tree Data Successfully Loaded:", tree);
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
            if (node.children && node.children.length > 0) {
                return {
                    [node.name]: {
                        categoryItem: {
                            text: node.name,
                            link: `/${url_path.toLowerCase()}/${node.name.toLowerCase().replace(/ /g, '-')}`,
                        },
                        subItems: buildMenuLinks(node.children, `${url_path}/${node.name.toLowerCase().replace(/ /g, '-')}`),
                    }
                } as MenuLink;
            } else {
                return {
                    text: node.name,
                    link: `/${url_path.toLowerCase()}/${node.name.toLowerCase().replace(/ /g, '-')}`,
                } as MenuItem;
            }
        });
    };

    return (
        <nav className="w-full flex">
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
    );
}
