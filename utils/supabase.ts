import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.kdvvvldbetjthldhodab.supabase.co!;
const supabaseKey = process.env.sb_publishable_iXJZqP3aj3ZhHXRUkDze4Q_kPDJdq4k!;

export const supabase = createClient(supabaseUrl, supabaseKey);
