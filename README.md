# 📚 Minha Monitoria

Um aplicativo web dinâmico e interativo projetado para simular o ranqueamento de vagas de monitoria acadêmica. Inspirado na mecânica do SISU (Sistema de Seleção Unificada), o sistema permite que estudantes simulem suas posições em tempo real, acompanhem notas de corte parciais e tomem decisões estratégicas sobre em qual disciplina desejam concorrer.

## ✨ Principais Funcionalidades

- **Dinâmica Estilo SISU:** Ranqueamento em tempo real dividindo os candidatos entre vagas *Remuneradas* e *Voluntárias*, com base na nota final (Média da Disciplina + IRA).
- **Cortes Parciais Temporizados:** O sistema calcula e exibe notas de corte históricas baseadas em "janelas" de tempo (ex: a cada 5 horas), permitindo que os alunos acompanhem a evolução do ranking.
- **Proteção e Exclusividade:** 
  - Regra de ouro: Um aluno só pode ocupar **1 vaga no sistema inteiro**. Se ele mudar de disciplina, sua submissão é transferida automaticamente.
  - Memória inteligente: O sistema preserva o registro da nota da matéria e do IRA do usuário, impedindo alterações posteriores nessas métricas (apenas a modalidade de concorrência pode ser trocada).
- **Autenticação Segura (Magic Link):** Login sem senha através de links mágicos enviados por e-mail utilizando o Supabase Auth.
- **Modo Anônimo:** Candidatos podem optar por não expor seus nomes no ranking público.
- **Busca em Tempo Real:** Motor de pesquisa rápido para filtrar disciplinas.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) (React), TypeScript.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com paletas personalizadas (Dark Mode / Blue SISU theme).
- **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL) para armazenamento de dados, RLS e autenticação via Magic Link.
- **Ícones:** [Lucide React](https://lucide.dev/).

## 🚀 Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- NPM ou Yarn
- Um projeto criado no [Supabase](https://supabase.com/) com as tabelas configuradas (`disciplines` e `submissions`).

### 2. Configurando o Ambiente
Crie um arquivo `.env.local` na raiz do projeto e preencha com as suas chaves do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Instalando e Rodando

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo em funcionamento.

## 🔒 Regras de Negócio e Triggers (PostgreSQL)

O aplicativo utiliza regras diretamente no banco de dados para garantir a integridade do processo seletivo:
- Trigger `trigger_check_ira_immutable`: Impede que um aluno altere seu próprio IRA caso ele tente enviar um payload malicioso.
- O Frontend cuida ativamente para que um aluno não apareça simultaneamente no ranking de duas matérias, priorizando a submissão mais recente através de lógicas robustas no agrupamento de dados.

## 🤝 Contribuindo
Este projeto foi construído sob demanda para fornecer máxima transparência e emoção em seleções acadêmicas. Sinta-se à vontade para enviar *pull requests* com melhorias visuais ou de arquitetura.
