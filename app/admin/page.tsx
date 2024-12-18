'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authStatus } from '@/auth';
import Header from '../components/header';
import AboutMeForm from './components/home_edit';
import NavTree from './components/nav_tree';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await authStatus();
      console.log("Auth status: ", status);
      setIsAuthenticated(status);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === false) {
    return <p>Not authorized</p>;
  }

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Prevent flashing of the page
  }

  return (
    <>
      <Header mainText="ADMIN PANEL" />
      <AboutMeForm />
      <NavTree />
    </>
  );
}
