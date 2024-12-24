import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../components/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';
import LinkOverrideManager from './components/ovveride_links';
import NewPost from './components/new_post';
import ExpandableSection from '../components/expandable_section';
import Tooltip from '../components/tooltip';

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
      
      <ExpandableSection title="Modify About Me Content">
        <Tooltip>
          <p>
            This section is used to modify the content that appears first on the home page.
          </p>
        </Tooltip>
        <AboutMeForm />
      </ExpandableSection>
      
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

      <ExpandableSection title="Create New Post">
        <Tooltip>
          <p>
            This section is used to create a new post. The post will be added to the database and will be displayed on the home page
            if it is tagged with the appropriate category.
          </p>
        </Tooltip>
        <NewPost />
      </ExpandableSection>
    </>
  );
}