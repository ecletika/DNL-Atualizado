import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ragmsmrwqxfmaudoqhse.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZ21zbXJ3cXhmbWF1ZG9xaHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODM5NDMsImV4cCI6MjA4NDI1OTk0M30.nfh-u2t8z85mvMuKKlTyTIv8397Hh9Ju0ye5pS1UA-Q';

export const supabase = createClient(supabaseUrl, supabaseKey);