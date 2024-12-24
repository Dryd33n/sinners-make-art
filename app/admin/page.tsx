import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../components/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';
import LinkOverrideManager from './components/ovveride_links';
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
            This section is used to ovveride the default destination of a navigation link. By default, a page is created based
            on the order of the link and it is populated with posts tagged in that category, use this page for special pages that
            will not be populated automatically with posts. For custom paths use the format "/path/to/destination" such that the result
            would be "https://sinners-make-art.com/path/to/destination".
          </p>
        </Tooltip>
        <LinkOverrideManager />
      </ExpandableSection>
    </>
  );
}