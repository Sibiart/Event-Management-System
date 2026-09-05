import { djs, type DJ } from '../data/djs';
import { vendors, type Vendor } from '../data/vendors';
import { venues, type Venue } from '../data/venues';
import { supabase } from './supabaseClient';

export interface CatalogData {
  venues: Venue[];
  djs: DJ[];
  vendors: Vendor[];
}

export const getDefaultCatalog = (): CatalogData => ({
  venues: [...venues],
  djs: [...djs],
  vendors: [...vendors],
});

export const getCatalog = async (): Promise<CatalogData> => {
  const [{ data: venueRows, error: venueError }, { data: djRows, error: djError }, { data: vendorRows, error: vendorError }] = await Promise.all([
    supabase.from('venues').select('*'),
    supabase.from('djs').select('*'),
    supabase.from('vendors').select('*'),
  ]);
  if (venueError) throw venueError;
  if (djError) throw djError;
  if (vendorError) throw vendorError;
  return {
    venues: (venueRows || []) as Venue[],
    djs: (djRows || []) as DJ[],
    vendors: (vendorRows || []) as Vendor[],
  };
};

export const setCatalog = async (catalog: CatalogData): Promise<void> => {
  const results = await Promise.all([
    supabase.from('venues').upsert(catalog.venues),
    supabase.from('djs').upsert(catalog.djs),
    supabase.from('vendors').upsert(catalog.vendors),
  ]);
  const failed = results.find(({ error }) => error);
  if (failed?.error) throw failed.error;
};
