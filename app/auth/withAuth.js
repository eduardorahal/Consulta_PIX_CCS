'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { verifyJwtToken } from './validateToken';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isValid, setIsValid] = useState(null); // null indicates loading state

    useEffect(() => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      if (!token) {
        router.push('/auth/login');
      } else {
        verifyJwtToken(token).then(isValid => {
          if (!isValid) {
            router.push('/auth/login');
          } else {
            setIsValid(true);
          }
        });
      }
    }, [router]);

    if (isValid === null) {
      return <div>Loading...</div>; // Or a spinner component
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;