-- 記事を管理するためのテーブル (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL, -- MDXテキストまたはHTMLなど
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. 誰でもSELECT可能にするポリシー (閲覧用)
CREATE POLICY "Public posts are viewable by everyone."
  ON public.posts FOR SELECT
  USING ( true );

-- 2. 認証済みユーザー(authenticated)のみがINSERTを行えるポリシー
CREATE POLICY "Enable insert for authenticated users only"
  ON public.posts FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- 3. 認証済みユーザー(authenticated)のみがUPDATEを行えるポリシー
CREATE POLICY "Enable update for authenticated users only"
  ON public.posts FOR UPDATE
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- 4. 認証済みユーザー(authenticated)のみがDELETEを行えるポリシー
CREATE POLICY "Enable delete for authenticated users only"
  ON public.posts FOR DELETE
  TO authenticated 
  USING (true);


-- 更新日時の自動更新用Trigger関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
