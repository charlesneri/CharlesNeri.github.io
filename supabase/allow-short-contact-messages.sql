-- Run this once in Supabase SQL Editor if you already created contact_messages.
alter table public.contact_messages
  drop constraint if exists contact_messages_message_check;

alter table public.contact_messages
  add constraint contact_messages_message_check
  check (char_length(message) between 1 and 5000);
