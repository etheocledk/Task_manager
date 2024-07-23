import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL='https://buzaanrtqctakngyplda.supabase.co'
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1emFhbnJ0cWN0YWtuZ3lwbGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MDEwMzMsImV4cCI6MjAzNzE3NzAzM30.xaQNEirqLYl-NAwZWuPF-fs8jRtlHodtf4kyGD0qgPk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)