import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjdxmbbcoboiksaqamtd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZHhtYmJjb2JvaWtzYXFhbXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNDQ0ODIsImV4cCI6MjA2NjcyMDQ4Mn0.byNcsjwqKQLdB3RTo0RvGZPbEh3HgxUL-FnAC20aEBs'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 