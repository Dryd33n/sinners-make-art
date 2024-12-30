import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../components/global/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';
import LinkOverrideManager from './components/ovveride_links';
import NewPost from './components/new_post';
import ReorderEditPosts from './components/reorder_edit_posts';
import ExpandableSection from './components/shared/expandable_section';
import Tooltip from './components/shared/tooltip';
import SocialLinks from './components/social_links';

export const metadata = {
  title: 'Admin Panel',
};

export default async function AdminPage() {
  // Check auth status from the server-side cookies
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');
  const isAuthenticated = authCookie?.value === 'true';

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    redirect('/admin/login');
  }

  return (
    <>
      <Header mainText="ADMIN PANEL" />

      <h1 className='text-3xl font-extralight mx-14 mb-5 mt-10'>MANAGE SITE CONTENT:</h1>

      <ExpandableSection title="Modify About Me Content">
        <Tooltip>
          <p>
            This section is used to modify the content that appears first on the home page.
          </p>
        </Tooltip>
        <AboutMeForm />
      </ExpandableSection>
      <ExpandableSection title="Social Media Links">
        <SocialLinks />
      </ExpandableSection>

      <h1 className='text-3xl font-extralight mx-14 mb-5 mt-10'>MANAGE POSTS:</h1>

      <ExpandableSection title="Create New Post">
        <Tooltip>
          <p>
            This section is used to create a new post. The post will be added to the database and will be displayed on the home page
            if it is tagged with the appropriate category.
          </p>
        </Tooltip>
        <NewPost />
      </ExpandableSection>

      <ExpandableSection title="Reorder and Edit Posts">
        <ReorderEditPosts />
      </ExpandableSection>

      <h1 className='text-3xl font-extralight mx-14 mb-5 mt-10'>MANAGE SITE STRUCTURE:</h1>

      <ExpandableSection title="Modify Navigation Schema">
        <Tooltip>
          <p>
            This section is used to modify the links which appear in the navigation bar.
          </p>
        </Tooltip>
        <NavTree />
      </ExpandableSection>

      <ExpandableSection title="Modify Navigation Destinations">
        <Tooltip>
          <p>
            This section is used to modify certain links in the navigation tree to redirect to premade pages
            instead of the default behavior of auto generating the pages based on the posts tagged with the category.
          </p>
        </Tooltip>
        <LinkOverrideManager />
      </ExpandableSection>

    </>
  );
}