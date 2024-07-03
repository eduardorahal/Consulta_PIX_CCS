'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, memo } from 'react';
import { verifyJwtToken } from './validateToken';

const withAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const router = useRouter();
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

          if (!token) {
            router.push('/auth/login');
            return;
          }

          const isValid = await verifyJwtToken(token);

          if (!isValid) {
            router.push('/auth/login');
          } else {
            setIsValid(true);
          }
        } catch (error) {
          console.error('Failed to verify token', error);
          router.push('/auth/login');
        }
      };

      checkAuth();

      // Cleanup function
      return () => {
        setIsValid(null);
      };
    }, [router]);

    if (isValid === null) {
      return <div>Loading...</div>; // Or a spinner component
    }

    return <WrappedComponent {...props} />;
  };

  return memo(AuthWrapper);
};

export default withAuth;