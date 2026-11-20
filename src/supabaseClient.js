import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wndahtdaacvfufwsvmpc.supabase.co'
const supabaseAnonKey = 'sb_publishable_F701e9LnyhgGOnyzaY3Gyg_Xx8chn3K'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)