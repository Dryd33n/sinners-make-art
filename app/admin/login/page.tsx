'use client'

import Header from '@/app/components/header';
import { redirect } from 'next/navigation';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Basic form validation
      if (!email) {
        setError('username is required');
        return;
      }
      if (!password) {
        setError('password is required');
        return;
      }
  
      // Clear any previous errors
      setError('');
  
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });
  
      if (response.status === 401) {
        setError('Invalid credentials');
        return;
      }
  
      // Handle successful login
      if (isClient) {
        router.push('/admin');
      }
    };

    return (
        <>
        <Header mainText="ADMIN PANEL LOGIN" />
        <div className="flex  justify-center min-h-screen bg-grey-900">
            <div className="w-full max-w-md max-h-[350] mt-10 p-8 space-y-4 bg-grey-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                {error && (
                    <div className="p-2 mx-10 text-sm text-red-700 bg-transparent border border-red-900 rounded-md">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-white">Username</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter admin username"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-white">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                    >
                        Login
                    </button>
                </form> 
            </div>
        </div>
        </>
    );
};

export default LoginForm;
