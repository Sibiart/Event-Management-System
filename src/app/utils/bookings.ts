import { supabase } from './supabaseClient';

export interface Booking {
  id: string;
  userId: string;
  type: 'venue' | 'vendor' | 'dj' | 'artist';
  itemId: string;
  itemName: string;
  date: string;
  guests?: number;
  cost: number;
  details: any;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

type BookingRow = {
  id: string;
  user_id: string;
  type: Booking['type'];
  itemid?: string;
  itemname: string;
  date: string;
  guests?: number;
  cost: number;
  details: any;
  status: Booking['status'];
  createdat: string;
};

const fromRow = (row: BookingRow): Booking => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  itemId: row.itemid || '',
  itemName: row.itemname,
  date: row.date,
  guests: row.guests,
  cost: row.cost,
  details: row.details,
  status: row.status,
  createdAt: row.createdat,
});

const toRow = (booking: Booking) => ({
  id: booking.id,
  user_id: booking.userId,
  type: booking.type,
  itemid: booking.itemId,
  itemname: booking.itemName,
  date: booking.date,
  guests: booking.guests,
  cost: booking.cost,
  details: booking.details,
  status: booking.status,
  createdat: booking.createdAt,
});

export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase.from('bookings').select('*').order('createdat', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase.from('bookings').select('*').eq('user_id', userId).order('createdat', { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
};

export const addBooking = async (booking: Booking): Promise<void> => {
  const { error } = await supabase.from('bookings').insert(toRow(booking));
  if (error) throw error;
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<void> => {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw error;
};

export const deleteBooking = async (bookingId: string): Promise<void> => {
  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
  if (error) throw error;
};

export const getVenueBookingsForDate = async (venueId: string, date: string): Promise<Booking[]> => {
  const { data, error } = await supabase.from('bookings').select('*').eq('itemid', venueId).eq('date', date);
  if (error) throw error;
  return (data || []).map(fromRow);
};

export const isVenueAvailable = async (venueId: string, date: string): Promise<boolean> => {
  const bookings = await getVenueBookingsForDate(venueId, date);
  return bookings.length === 0;
};