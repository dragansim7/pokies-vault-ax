alter table fetch_runs add column if not exists user_id text;
delete from fetch_runs where user_id is null;
alter table fetch_runs alter column user_id set not null;
create index if not exists fetch_runs_user_id_idx on fetch_runs (user_id, id desc);
