import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const listenToAuth = useAuthStore((s) => s.listenToAuth);

  useEffect(() => {
    const unsub = listenToAuth();
    return unsub;
  }, [listenToAuth]);

  return <>{children}</>;
}
