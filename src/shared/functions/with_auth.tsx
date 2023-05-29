import { userAtom } from '@/recoil-state/user/user.atom';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

function withAuth(WrappedComponent: ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const userState = useRecoilValue(userAtom);

    useEffect(() => {
        console.log('state: ', userState.user)
      if (!userState.user) {
        // Redirect to the register page if the user is not found
        router.replace('/register');
      }
    }, [userState.user]);

    return userState.user ? <WrappedComponent {...props} /> : null;
  };
}

export default withAuth;