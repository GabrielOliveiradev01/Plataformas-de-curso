# Geele - Plataforma de Cursos Online

Uma plataforma SaaS de cursos online inspirada no Netflix, com design moderno, dark mode, minimalista e premium.

## 🚀 Stack Tecnológica

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Shadcn/ui**
- **Lucide React**
- **Framer Motion**
- **Supabase** (Auth + Database)

## 📋 Funcionalidades

### Layout Principal
- ✅ Sidebar fixa à esquerda com navegação
- ✅ Topbar com busca, notificações e avatar (dados do Supabase)
- ✅ Tema escuro (#0f0f13)
- ✅ Cards de módulos com animações suaves

### Páginas
- ✅ **Dashboard**: Módulos disponíveis
- ✅ **Página de Curso**: Player de vídeo, módulos expansíveis, barra de progresso
- ✅ **Área do Instrutor**: Criar cursos, módulos e aulas
- ✅ **Login/Registro**: Autenticação com Supabase (Email + Google)
- ✅ **Perfil/Configurações**: Gerenciar perfil com dados do Supabase
- ✅ **Explorar**: Busca e descoberta de módulos

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase:
   - Acesse o SQL Editor no painel do Supabase
   - Execute o script `supabase-schema.sql` para criar as tabelas
   - Configure o Storage para avatares (opcional):
     - Crie um bucket chamado "avatars"
     - Configure políticas públicas para leitura

4. Configure as variáveis de ambiente:
   - O arquivo `.env.local` já está configurado com suas credenciais

5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 📊 Estrutura do Banco de Dados

### Tabelas Criadas:
- `profiles` - Perfis de usuário
- `courses` - Cursos
- `modules` - Módulos dos cursos
- `lessons` - Aulas dos módulos
- `user_progress` - Progresso do usuário nas aulas

### Políticas RLS:
- Usuários podem visualizar todos os cursos e módulos
- Apenas instrutores podem criar/editar/deletar cursos
- Usuários podem gerenciar apenas seu próprio progresso

## 🎨 Design

- Tema escuro premium (#0f0f13)
- Animações suaves com Framer Motion
- Cards com hover effects (scale + shadow + gradient overlay)
- Layout responsivo e moderno

## 📝 Notas

- A plataforma é focada em módulos e aulas (sem sistema de compras)
- Todos os dados são gerenciados pelo Supabase
- O perfil do usuário é criado automaticamente no registro
- O progresso é rastreado por aula
