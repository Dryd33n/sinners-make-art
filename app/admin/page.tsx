import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../components/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';

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
      <h1 className='text-4xl m-5 font-extralight'>MODIFY ABOUT ME CONTENT:</h1>
      <AboutMeForm />
      <h1 className='text-4xl m-5 font-extralight'>MODIFY NAVIGATION SCHEMA:</h1>
      <NavTree />
    </>
  );
}
