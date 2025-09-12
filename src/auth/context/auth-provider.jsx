import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { isValidToken } from './utils';
import { STORAGE_KEY } from './constant';
import { AuthContext } from './auth-context';


// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  // const checkUserSession = useCallback(async () => {
  //   try {
  //     const accessToken = sessionStorage.getItem(STORAGE_KEY);
  //     if (accessToken && isValidToken(accessToken)) {
  //       setState({ user: { accessToken }, loading: false });
  //     } else {
  //       setState({ user: null, loading: false });
  //     }
  //   } catch (error) {
  //     console.error("Error checking user session:", error);
  //     setState({ user: null, loading: false });
  //   }
  // }, [setState]);

  // useEffect(() => {
  //   checkUserSession();
  //   // sessionStorage.clear();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // ----------------------------------------------------------------------
  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setState({ user: { accessToken }, loading: false });
      } else {
        sessionStorage.clear(); // 
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      sessionStorage.clear(); 
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession(); 
  }, [checkUserSession]);

  // 🟨 Auto refresh setup
// useEffect(() => {
//   let inactivityTimeout;
//   const MAX_INACTIVITY_TIME = 1 * 60 * 1000; // 2 minutes

//   const resetInactivityTimer = () => {
//     console.log('[Inactivity] User active, resetting timer...');
//     clearTimeout(inactivityTimeout);
//     inactivityTimeout = setTimeout(() => {
//       console.log('[Inactivity] Timeout reached, refreshing token...');
//       refreshSession();
//     }, MAX_INACTIVITY_TIME);
//   };

//   const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
//   events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
//   resetInactivityTimer();

//   return () => {
//     clearTimeout(inactivityTimeout);
//     events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
//   };
// }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo( 
    () => ({
      user: state.user
        ? {
          ...state.user,
          role: state.user?.role ?? 'admin',
        }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
