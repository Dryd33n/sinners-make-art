import { notFound } from 'next/navigation';
import React from 'react';
import Header from '../components/global/header';
import Post from '../components/global/post';
import NavBar from '../components/global/navBar';
import Footer from '../components/global/footer';
import HomeButton from '../components/global/home_button';
import { capitalizeFirstLetter } from '../utils/utils';
import { PostItem } from '@/db/schema';

interface FilterPostsByCategory {
  (posts: PostItem[], category: string): PostItem[];
}


type PostsByTag = {
  [tag: string]: PostItem[];
};

const baseUrl = 'https://sinners-make.art';
//const baseUrl = 'http://localhost:3000';

export async function generateMetadata({ params, }: { params: Promise<{ category: string }> }) {
  const { category } = await Promise.resolve(params);
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

const groupPosts = (posts: PostItem[]) => {
  const groupedPosts = posts.reduce((acc: PostsByTag, post: PostItem) => {
    const tags = post.tag.split('/');

    // Add the post to the highest level of the tag hierarchy
    for (let i = 1; i <= tags.length; i++) {
      const tag = tags.slice(0, i).join('/');
      if (!acc[tag]) {
        acc[tag] = [];
      }
    }

    acc[post.tag].push(post);
    return acc;
  }, {} as PostsByTag);

  // Sort the posts by order within each tag
  Object.keys(groupedPosts).forEach(tag => {
    groupedPosts[tag].sort((a, b) => a.order - b.order);
  });

  // Ensure tags are ordered hierarchically by sorting the keys
  const orderedGroupedPosts = Object.keys(groupedPosts)
    .sort((a, b) => a.split('/').length - b.split('/').length)
    .reduce((acc: PostsByTag, tag: string) => {
      acc[tag] = groupedPosts[tag];
      return acc;
    }, {} as PostsByTag);

  return orderedGroupedPosts;
};

const Page = async ({ params, }: { params: Promise<{ category: string }> }) => {
  // Use `await` if you need to fetch data related to `category`
  const { category } = await Promise.resolve(params);

  const validCategories = await fetchValidCategories();
  const posts = await fetchPosts();
  const filteredPosts = filterPostsByCategory(posts, category);
  const groupedPosts: PostsByTag = groupPosts(filteredPosts);

  Object.keys(groupedPosts).forEach(tag => {
  console.log(`Tag: ${tag}`);
  });
  

  if (!validCategories.includes(category)) {
    notFound();
  }

  return (<>
    <div className='grey-900'>
      <Header mainText={category.toUpperCase()} />
      <NavBar />
      <HomeButton />
      <div>
        {Object.keys(groupedPosts).map(tag => (
          <div key={tag} id={tag.toLowerCase().replace(/[\s/]+/g, "-")}>
            {groupedPosts[tag].length > 0 && (
              <><h2 className="text-3xl font-extralight mb-2 ml-10 tracking-wider">{tag.replace(/\//g, ' - ')}</h2><div className='bg-white opacity-25 h-[0.1] mx-10'></div><div className="posts">
                {groupedPosts[tag].map(post => (
                  <Post key={post.id} post={post} />
                ))}
              </div></>)}
          </div>
        ))}
      </div>
    </div>

    <Footer />
  </>);
};

export default Page;