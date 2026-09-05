import { supabase } from './supabaseClient';

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  bookingId?: string;
  read: boolean;
  createdAt: string;
}

type NotificationRow = {
  id: string;
  user_id: string;
  type: Notification['type'];
  title: string;
  message: string;
  booking_id?: string;
  read: boolean;
  created_at: string;
};

const fromRow = (row: NotificationRow): Notification => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  title: row.title,
  message: row.message,
  bookingId: row.booking_id,
  read: row.read,
  createdAt: row.created_at,
});

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
  return count || 0;
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
  const { error } = await supabase.from('notifications').insert({
    id: crypto.randomUUID(),
    user_id: notification.userId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    booking_id: notification.bookingId,
    read: notification.read,
  });
  if (error) throw error;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
  if (error) throw error;
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
  if (error) throw error;
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
  if (error) throw error;
};
