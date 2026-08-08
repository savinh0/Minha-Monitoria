-- Tabelas
CREATE TABLE public.disciplines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  course text NOT NULL,
  vagas_remuneradas integer NOT NULL DEFAULT 0,
  vagas_voluntarias integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'abertas',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  discipline_id uuid REFERENCES public.disciplines(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  candidate_name text NOT NULL,
  is_anonymous boolean DEFAULT false NOT NULL,
  subject_score numeric(4,2) NOT NULL,
  ira numeric(6,4) NOT NULL,
  final_score numeric(6,4) NOT NULL,
  modality_preference text NOT NULL,
  trend text DEFAULT 'same',
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(discipline_id, user_id) -- Impede que o mesmo usuário envie duas vezes para a mesma disciplina, permitindo apenas update
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Políticas para Disciplines
CREATE POLICY "Disciplines são públicas para leitura" ON public.disciplines
  FOR SELECT USING (true);

-- Política de Admin para Disciplines (Apenas quem tiver o email de admin)
-- Substitua 'SEU_EMAIL_AQUI' pelo seu e-mail institucional
CREATE POLICY "Apenas admin pode modificar disciplinas" ON public.disciplines
  FOR ALL USING (auth.jwt() ->> 'email' = 'SEU_EMAIL_AQUI');

-- Políticas para Submissions
CREATE POLICY "Submissions são públicas para leitura" ON public.submissions
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir suas próprias submissões" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias submissões" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Restrição de IRA Imutável por Usuário (Trigger)
CREATE OR REPLACE FUNCTION check_ira_immutable()
RETURNS TRIGGER AS $$
BEGIN
  -- Se for um UPDATE e o IRA estiver mudando, aborta
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.ira IS DISTINCT FROM NEW.ira) THEN
      RAISE EXCEPTION 'O IRA não pode ser alterado após o primeiro envio.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_ira_immutable
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION check_ira_immutable();
