import { supabase } from './supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

let currentUser: User | null = null;

const toUser = (profile: { id: string; name: string; email: string; phone?: string | null; is_admin?: boolean }): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  phone: profile.phone || '',
  isAdmin: profile.is_admin || false,
});

export const getCurrentUser = (): User | null => currentUser;

export const restoreSession = async (): Promise<User | null> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    currentUser = null;
    return null;
  }

  const { data: profile, error } = await supabase
    .from('users')
    .select('id, name, email, phone, is_admin')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  currentUser = profile ? toUser(profile) : {
    id: session.user.id,
    name: session.user.user_metadata.name || session.user.email || 'User',
    email: session.user.email || '',
    phone: session.user.user_metadata.phone || '',
  };
  return currentUser;
};

export const subscribeToAuthChanges = (onChange: (user: User | null) => void) =>
  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      currentUser = null;
      onChange(null);
      return;
    }
    void restoreSession().then(onChange).catch((error) => {
      console.error('Unable to restore Supabase session:', error.message);
      onChange(null);
    });
  });

export const login = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;
  return restoreSession();
};

export const signup = async (name: string, email: string, phone: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, phone } },
  });
  if (error) throw error;
  if (!data.user) return null;
  if (!data.session) {
    currentUser = null;
    return null;
  }
  return restoreSession();
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  currentUser = null;
};
