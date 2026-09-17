import { useApp } from '@/context/AppContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { currentUser } = useApp();

  // If no user is logged in, show Login screen first by default
  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  // Otherwise navigate to main tabs
  return <Redirect href="/(tabs)" />;
}

