-- keep_alive 表:供每日保活请求触达数据库,防止免费项目因 7 天无活动被自动暂停。
-- 单行表(id 固定为 1),数据无敏感信息,允许 public 读写以便 anon key 保活。

create table if not exists public.keep_alive (
  id int primary key default 1 check (id = 1),
  touched_at timestamptz not null default now()
);

insert into public.keep_alive (id, touched_at)
values (1, now())
on conflict (id) do nothing;

alter table public.keep_alive enable row level security;

-- 保活端点(/api/keep-alive)和 GitHub Actions 通过 anon key 访问
create policy "keep_alive public select"
  on public.keep_alive
  for select
  using (true);

create policy "keep_alive public update"
  on public.keep_alive
  for update
  using (true)
  with check (true);
