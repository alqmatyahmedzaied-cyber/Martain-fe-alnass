create table app_state(id text primary key,data jsonb not null default '{}',updated_at timestamptz default now());
alter table app_state enable row level security;
create policy "auth rw" on app_state for all to authenticated using(true) with check(true);
alter publication supabase_realtime add table app_state;
create table push_subs(uid uuid primary key,sub jsonb);
alter table push_subs enable row level security;
create policy "own" on push_subs for all to authenticated using(auth.uid()=uid) with check(auth.uid()=uid);
-- أول مضيف: أنشئ مستخدماً في Auth > Users (email: رمزك@shilla.app وكلمة المرور = الرمز) ثم ضع الـ UUID هنا:
insert into app_state(id,data) values('main','{"members":[{"id":"m1","name":"المضيف","uid":"AUTH_USER_UUID","admin":true}],"queue":["m1"],"days":{},"msgs":[],"fts":[],"votes":{},"u":1}');
