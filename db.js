import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.5";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";


const env = await load();


const URL = env["URL"];
const SECRET = env["SECRET"]



// Create a single supabase client for interacting with your database
const supabase = createClient(URL,
     SECRET)

 


export default supabase