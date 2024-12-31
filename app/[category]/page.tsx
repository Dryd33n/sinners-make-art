import { notFound } from 'next/navigation';
import Header from '../components/global/header';
import Post from '../components/global/post';
import NavBar from '../components/global/navBar';
import Footer from '../components/global/footer';
import HomeButton from '../components/global/home_button';
import { capitalizeFirstLetter } from '../utils/utils';
import { PostItem } from '@/db/schema';

interface Tag{
  path: string,
  order: number,
}

interface PostsByTag{
  tag: string,
  posts: PostItem[]
}



const baseUrl = 'https://sinners-make.art';
//const baseUrl = 'http://localhost:3000';

export async function generateMetadata({ params, }: { params: Promise<{ category: string }> }) {
  const { category } = await Promise.resolve(params);
  return {
    title: `${capitalizeFirstLetter(category)} | Sinners Make Art`,
    description: `Explore posts in the ${category} category`,
  };
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

function sortHierarchical(data: Tag[]){
  /**
   * Sorts hierarchical data based on the `order` properties at each hierarchy level.
   *
   * Args:
   *     data: List of objects with `path` and `order` keys.
   *
   * Returns:
   *     Sorted list of objects.
   */

  const hierarchy: Map<number, Array<typeof data[0]>> = new Map();

  // Group items by their hierarchy level
  data.forEach(item => {
      const levels = item.path.split("/").length;
      if (!hierarchy.has(levels)) {
          hierarchy.set(levels, []);
      }
      hierarchy.get(levels)!.push(item);
  });

  // Sort items within each hierarchy level by `order`
  hierarchy.forEach((items) => {
      items.sort((a, b) => a.order - b.order);
  });

  // Rebuild the sorted list
  const sortedData: Array<typeof data[0]> = [];

  function addItems(level: number, parentPath: string | null): void {
      const items = hierarchy.get(level);
      if (!items) return;

      items.forEach(item => {
          if (!parentPath || item.path.startsWith(parentPath + "/") || item.path === parentPath) {
              sortedData.push(item);
              addItems(level + 1, item.path);
          }
      });
  }

  // Start with top-level items (level 1)
  addItems(1, null);

  return sortedData;
}

function generatePostDictTemplate(tags: Tag[]){
  const postDictArr: PostsByTag[] = [];

  tags.forEach(tag => {
    postDictArr.push({tag: tag.path, posts: []});
  });

  return postDictArr;
}

function getPostDictArr(tags: Tag[], posts: PostItem[]){
  const postsArray: PostsByTag[] = generatePostDictTemplate(sortHierarchical(tags))
  
  postsArray.forEach(postDict => {
    const tag = postDict.tag;
    const filteredPosts = posts.filter(post => post.tag === tag);
    filteredPosts.sort((a, b) => a.order - b.order);
    postDict.posts = filteredPosts;
  });

  return postsArray;
}


const Page = async ({ params, }: { params: Promise<{ category: string }> }) => {

  // Use `await` if you need to fetch data related to `category`
  const { category } = await Promise.resolve(params);

  const allTags = await fetchTags();
  const validCategories = await fetchValidCategories();
  const posts = await fetchPosts();
  const postArr = getPostDictArr(allTags, posts);

  async function fetchValidCategories() {
    const res = await fetch(`${baseUrl}/api/admin/navtree`);
    const result = await res.json();
  
    if (!result.success) {
      throw new Error('Failed to fetch navigation tree');
    }
  
    return result.data.map((item: { path: string; }) => item.path.toLowerCase());
  }

  async function fetchTags() {
    const res = await fetch(`${baseUrl}/api/admin/navtree`);
    const result = await res.json();
  
    if (!result.success) {
      throw new Error('Failed to fetch navigation tree');
    }
  
    const allTags: Tag[] = result.data;

    return allTags.filter((tag: Tag) => tag.path.startsWith(`${category.toUpperCase()}/`) || tag.path === category.toUpperCase());
  }
  
  

  if (!validCategories.includes(category)) {
    notFound();
  }

  return (<>
    <div className='grey-900'>
      <Header mainText={category.toUpperCase()} />
      <NavBar />
      <HomeButton />
      <div>
        {postArr.map(postsByTag => (
          <div key={postsByTag.tag} id={postsByTag.tag.toLowerCase().replace(/[\s/]+/g, "-")}>
            {postsByTag.posts.length > 0 && (
              <><h2 className="text-3xl font-extralight mb-2 ml-10 tracking-wider">{postsByTag.tag.replace(/\//g, ' - ')}</h2><div className='bg-white opacity-25 h-[0.1] mx-10'></div><div className="posts">
                {postsByTag.posts.map(post => (
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