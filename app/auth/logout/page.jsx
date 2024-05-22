'use client'

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Context } from '@/app/context';

const LogoutPage = () => {
    const router = useRouter();
    const { dispatch } = React.useContext(Context);

    React.useEffect(() => {
        // Limpar o cookie de token
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Despachar a ação de logout
        dispatch({ type: 'logOut' });

        // Redirecionar para a página de login
        router.push('/auth/login');
    }, [dispatch, router]);

    return null;
};

export default LogoutPage;