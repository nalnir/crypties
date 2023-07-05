// AuthGuard.tsx
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useAuthActions } from './auth.actions';
import { authAtom } from './auth.atom';
import { useRouter } from 'next/router';
import { WithChildren } from '@/shared';

export const AuthGuard = ({ children }: WithChildren) => {
  const useAuth = useAuthActions();
  const authState = useRecoilValue(authAtom);
  const router = useRouter();

  useEffect(() => {
    useAuth.loadFromStorage();
  }, []);

  // if auth initialized with a valid user show protected page
  if (authState?.auth && authState.isLoggedIn) {
    return <div>{children}</div>
  }

  if (authState.isLocalStorageLoaded && !authState.auth) {
    router.replace('/login');
    return <div></div>
  }
  /* otherwise don't return anything, will do a redirect from useEffect */
  return <div></div>
};