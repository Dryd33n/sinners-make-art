import { notFound } from 'next/navigation';
import React from 'react';
import Header from '../components/header';
import Post from '../components/post';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import { capitalizeFirstLetter } from '../utils/utils';

interface FilterPostsByCategory {
  (posts: PostType[], category: string): PostType[];
}

type PostType = {
  id: number;
  title: string;
  description: string;
  type: string;
  content: string;
  tag: string;
  order: number;
  portfolio: boolean;
};

type PostsByTag = {
  [tag: string]: PostType[];
};

const baseUrl = 'https://sinners-make.art';
//const baseUrl = 'http://localhost:3000';

export async function generateMetadata({ params }: { params: { category: string } }) {
  const { category } = params;
  return {
    title: `${capitalizeFirstLetter(category)} | Sinners Make Art`,
    description: `Explore posts in the ${category} category`,
  };
}


async function fetchValidCategories() {
  console.log(`Fetching valid categories from (${baseUrl}/api/admin/navtree)`);
  const res = await fetch(`${baseUrl}/api/admin/navtree`);
  const result = await res.json();

  if (!result.success) {
    throw new Error('Failed to fetch navigation tree');
  }

  return result.data.map((item: { path: string; }) => item.path.toLowerCase());
}

const fetchPosts = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/posts`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      console.error('Failed to fetch posts:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

const filterPostsByCategory: FilterPostsByCategory = (posts, category) => {
  return posts.filter(post => post.tag.startsWith(`${category.toUpperCase()}/`));
};

const Page = async ({ params, }: { params: Promise<{ category: string }> }) => {
  // Use `await` if you need to fetch data related to `category`
  const { category } = await Promise.resolve(params);

  const validCategories = await fetchValidCategories();
  const posts = await fetchPosts();
  const filteredPosts = filterPostsByCategory(posts, category);

  const groupedPosts: PostsByTag = filteredPosts.reduce((acc: PostsByTag, post: PostType) => {
    if (!acc[post.tag]) {
      acc[post.tag] = [];
    }
    acc[post.tag].push(post);
    return acc;
  }, {} as PostsByTag);

  // Sort posts within each tag by their "order" field
  Object.keys(groupedPosts).forEach(tag => {
    groupedPosts[tag].sort((a, b) => a.order - b.order);
  });

  console.log('Posts:', groupedPosts);
  if (!validCategories.includes(category)) {
    notFound();
  }

  return (<>
    <div className='grey-900'>
      <Header mainText={category.toUpperCase()} />
      <NavBar />
      <div>
        {Object.keys(groupedPosts).map(tag => (
          <div key={tag} id={tag.toLowerCase().replace(/[\s/]+/g, "-")}>
            <h2 className="text-3xl font-extralight mb-2 ml-10 tracking-wider">{tag.replace(/\//g, ' - ')}</h2>
            <div className='bg-white opacity-25 h-[0.1] mx-10'></div>
            <div className="posts">
              {groupedPosts[tag].map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </>);
};

export default Page;
