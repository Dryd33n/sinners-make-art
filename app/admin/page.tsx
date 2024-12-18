import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../components/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';
import ExpandableSection from '../components/expandable_section';
import Head from 'next/head';

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
        <AboutMeForm />
      </ExpandableSection>
      
      <ExpandableSection title="Modify Navigation Schema">
        <NavTree />
      </ExpandableSection>
    </>
  );
}