# Configuração do Supabase

## Passo 1: Criar as Tabelas

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole todo o conteúdo do arquivo `supabase-schema.sql`
6. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

## Passo 2: Configurar Storage (Opcional - para avatares)

1. No painel do Supabase, vá em **Storage**
2. Clique em **Create a new bucket**
3. Nome: `avatars`
4. Marque como **Public bucket**
5. Clique em **Create bucket**

### Políticas do Storage:

Após criar o bucket, vá em **Policies** e adicione:

**Política de Upload:**
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Política de Leitura:**
```sql
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

## Passo 3: Verificar Tabelas Criadas

1. Vá em **Table Editor** no menu lateral
2. Você deve ver as seguintes tabelas:
   - `profiles`
   - `courses`
   - `modules`
   - `lessons`
   - `user_progress`

## Passo 4: Testar

1. Execute a aplicação: `npm run dev`
2. Acesse `http://localhost:3000`
3. Crie uma conta em `/auth/register`
4. O perfil será criado automaticamente
5. Acesse `/settings` para ver e editar seu perfil

## Estrutura das Tabelas

### profiles
- `id` (UUID) - Referência ao auth.users
- `name` (TEXT) - Nome do usuário
- `avatar_url` (TEXT) - URL da foto de perfil
- `bio` (TEXT) - Biografia do usuário

### courses
- `id` (UUID) - ID único
- `title` (TEXT) - Título do curso
- `description` (TEXT) - Descrição
- `thumbnail_url` (TEXT) - URL da thumbnail
- `instructor_id` (UUID) - ID do instrutor
- `duration` (TEXT) - Duração do curso

### modules
- `id` (UUID) - ID único
- `course_id` (UUID) - Referência ao curso
- `title` (TEXT) - Título do módulo
- `order_index` (INTEGER) - Ordem do módulo

### lessons
- `id` (UUID) - ID único
- `module_id` (UUID) - Referência ao módulo
- `title` (TEXT) - Título da aula
- `description` (TEXT) - Descrição
- `video_url` (TEXT) - URL do vídeo
- `duration` (TEXT) - Duração da aula
- `order_index` (INTEGER) - Ordem da aula

### user_progress
- `id` (UUID) - ID único
- `user_id` (UUID) - Referência ao usuário
- `lesson_id` (UUID) - Referência à aula
- `completed` (BOOLEAN) - Se a aula foi concluída
- `completed_at` (TIMESTAMP) - Data de conclusão

