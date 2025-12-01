# Aerocode - Sistema de Gerenciamento de Produção de Aeronaves

Sistema web completo para gerenciamento de produção de aeronaves, desenvolvido com **React + TypeScript** (front-end) e **Node.js + TypeScript + Prisma + MySQL** (back-end).

## 🏗️ Arquitetura

- **Front-end**: React 18 + TypeScript + Vite
- **Back-end**: Node.js + Express + TypeScript
- **Banco de Dados**: MySQL 8.0
- **ORM**: Prisma
- **Autenticação**: Session-based
- **Métricas**: Middleware personalizado para coleta de performance

## 📋 Funcionalidades

### Sistema de Autenticação
- Login com CPF e senha
- Controle de sessão
- Três níveis de permissão (Admin, Engenheiro, Operador)

### Gerenciamento de Aeronaves (Admin/Operador)
- ✅ Cadastrar aeronaves com código único
- ✅ Listar todas as aeronaves
- ✅ Editar informações
- ✅ Excluir aeronaves

### Gerenciamento de Peças (Admin/Operador)
- ✅ Cadastrar peças vinculadas a aeronaves
- ✅ Listar e filtrar peças
- ✅ Editar peças e avançar status progressivamente
- ✅ Controle de status (Em Produção → Pronta → Instalada)
- ✅ Excluir peças

### Gerenciamento de Etapas (Admin/Engenheiro)
- ✅ Cadastrar etapas de produção
- ✅ Listar etapas por aeronave
- ✅ Iniciar e finalizar etapas
- ✅ Associar/desassociar funcionários
- ✅ Controle de status (Pendente → Andamento → Concluída)

### Gerenciamento de Funcionários (Admin/Engenheiro)
- ✅ Cadastrar funcionários com CPF único
- ✅ Listar todos os funcionários
- ✅ Editar informações
- ✅ Excluir funcionários
- ✅ Definir níveis de permissão

### Gerenciamento de Testes (Admin/Engenheiro)
- ✅ Registrar testes de qualidade
- ✅ Listar todos os testes
- ✅ Filtrar testes por aeronave
- ✅ Registrar resultados (Aprovado/Reprovado)

### Geração de Relatórios (Admin/Engenheiro)
- ✅ Gerar relatórios completos de produção
- ✅ Visualizar relatório formatado na tela
- ✅ Exportar relatório em formato TXT
- ✅ Histórico de relatórios gerados

### Métricas de Performance
- ✅ Coleta automática de latência
- ✅ Medição de tempo de resposta
- ✅ Cálculo de tempo de processamento
- ✅ Endpoints para análise e comparação

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18.x ou superior
- MySQL 8.0 ou superior
- npm ou yarn

### Instalação

#### 1. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas credenciais do MySQL
npm run prisma:push
npm run seed
npm run dev
```

#### 2. Configurar Frontend

```bash
# Em outro terminal, na raiz do projeto
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## 👥 Usuários Padrão

O sistema vem com três usuários pré-cadastrados:

| CPF | Senha | Nível | Permissões |
|-----|-------|-------|------------|
| `000.000.000-00` | `admin` | Administrador | Acesso total |
| `111.111.111-11` | `eng123` | Engenheiro | Funcionários, Etapas, Testes, Relatórios |
| `222.222.222-22` | `oper123` | Operador | Aeronaves, Peças |

## 🛠️ Tecnologias Utilizadas

### Front-end
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router DOM** - Navegação entre páginas
- **CSS3** - Estilização responsiva

### Back-end
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM moderno para TypeScript
- **MySQL** - Banco de dados relacional
- **CORS** - Política de compartilhamento de recursos

### Ferramentas
- **tsx** - Executar TypeScript diretamente
- **Apache Bench** - Testes de carga
- **Git** - Controle de versão

## 📁 Estrutura do Projeto

```
AV3/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   │   ├── aeronaves.ts
│   │   │   ├── pecas.ts
│   │   │   ├── etapas.ts
│   │   │   ├── funcionarios.ts
│   │   │   ├── testes.ts
│   │   │   ├── relatorios.ts
│   │   │   └── metrics.ts
│   │   ├── middleware/
│   │   │   └── metrics.ts  # Coleta de métricas
│   │   ├── server.ts       # Servidor Express
│   │   └── seed.ts         # Dados iniciais
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── src/                     # Front-end React
│   ├── components/          # Componentes reutilizáveis
│   │   └── Navbar.tsx      # Barra de navegação
│   ├── contexts/           # Contextos React
│   │   └── AuthContext.tsx # Gerenciamento de autenticação
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── aeronaves/
│   │   ├── pecas/
│   │   ├── etapas/
│   │   ├── funcionarios/
│   │   ├── testes/
│   │   └── relatorios/
│   ├── services/           # Serviços de API
│   │   ├── apiService.ts   # Cliente HTTP
│   │   ├── aeronaveService.ts (legacy - localStorage)
│   │   └── ...
│   ├── types/              # Definições TypeScript
│   │   └── index.ts
│   └── App.tsx
├── SETUP_COMPLETO.md       # Guia de instalação detalhado
├── RELATORIO_QUALIDADE.md  # Template de relatório
└── README.md
```

## 💾 Persistência de Dados

Os dados são armazenados em **banco de dados MySQL** através do Prisma ORM:

**Tabelas:**
- `funcionarios` - Usuários do sistema
- `aeronaves` - Modelos de aeronaves
- `pecas` - Peças e componentes
- `etapas` - Etapas de produção
- `etapas_funcionarios` - Relacionamento N:N
- `testes` - Testes de qualidade
- `relatorios` - Relatórios gerados
- `metrics` - Métricas de performance

## 📊 Métricas de Performance

O sistema coleta automaticamente três métricas para cada requisição:

1. **Latência**: Tempo total da requisição (ms)
2. **Tempo de Resposta**: Tempo do ponto de vista do cliente (ms)
3. **Tempo de Processamento**: Tempo de CPU estimado (ms)

### Consultar Métricas

```bash
# Resumo agregado
curl http://localhost:3001/api/metrics/summary

# Comparar cenários (1, 5, 10 usuários)
curl http://localhost:3001/api/metrics/compare

# Métricas detalhadas
curl http://localhost:3001/api/metrics?limit=100
```

### Testes de Carga

```bash
# 1 usuário
ab -n 100 -c 1 http://localhost:3001/api/aeronaves

# 5 usuários
ab -n 100 -c 5 http://localhost:3001/api/aeronaves

# 10 usuários
ab -n 100 -c 10 http://localhost:3001/api/aeronaves
```

## 🎯 Funcionalidades Implementadas

### Validações
- ✅ Códigos únicos para aeronaves
- ✅ CPF único para funcionários
- ✅ Validação de existência de aeronaves ao criar peças/etapas/testes
- ✅ Prevenção de duplicatas (mesmo nome + mesma aeronave)
- ✅ Validação de campos obrigatórios
- ✅ Mensagens de erro claras e contextuais

### Controle de Permissões
- ✅ Menu dinâmico baseado no nível do usuário
- ✅ Rotas protegidas
- ✅ Redirecionamento automático para login
- ✅ Persistência de sessão

### Experiência do Usuário
- ✅ Formulários com validação em tempo real
- ✅ Confirmações antes de exclusões
- ✅ Mensagens de sucesso e erro
- ✅ Interface responsiva
- ✅ Feedback visual para todas as ações
- ✅ Listas escondidas durante edição

## 🌍 Compatibilidade

Testado e funcional em:
- ✅ Windows 10/11
- ✅ Ubuntu 24.04.03 LTS
- ✅ Distribuições derivadas do Ubuntu

## 📚 Documentação Adicional

- [`backend/README.md`](./backend/README.md) - Documentação completa da API
- [`SETUP_COMPLETO.md`](./SETUP_COMPLETO.md) - Guia de instalação passo a passo
- [`RELATORIO_QUALIDADE.md`](./RELATORIO_QUALIDADE.md) - Template para relatório de métricas

## 📝 Observações

- Sistema completo com back-end Node.js + MySQL
- Implementa todos os requisitos do sistema CLI original
- Coleta automática de métricas de performance
- Pronto para testes de carga com Apache Bench
- Baseado no sistema CLI: https://github.com/Doryumi/AV1

## 📄 Licença

ISC - Projeto desenvolvido para fins educacionais.


