create table if not exists fetch_runs (
  id bigserial primary key,
  source text not null,
  report jsonb not null,
  created_at timestamptz not null default now()
);
