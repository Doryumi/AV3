# Aerocode - Sistema de Gerenciamento de Produção de Aeronaves

Sistema web completo para gerenciamento de produção de aeronaves.

## Arquitetura

- React + TypeScript + Vite
- Node.js + Express + TypeScript
- MySQL
- Prisma
- Session-based


## Funcionalidades

### Sistema de Autenticação
- Login com CPF e senha
- Controle de sessão
- Três níveis de permissão (Admin, Engenheiro, Operador)

### Gerenciamento de Aeronaves (Admin/Operador)
- Cadastrar aeronaves com código único
- Listar todas as aeronaves
- Editar informações
- Excluir aeronaves

### Gerenciamento de Peças (Admin/Operador)
- Cadastrar peças vinculadas a aeronaves
- Listar e filtrar peças
- Editar peças e avançar status progressivamente
- Controle de status (Em Produção → Pronta → Instalada)
- Excluir peças

### Gerenciamento de Etapas (Admin/Engenheiro)
- Cadastrar etapas de produção
- Listar etapas por aeronave
- Iniciar e finalizar etapas
- Associar/desassociar funcionários
- Controle de status (Pendente → Andamento → Concluída)

### Gerenciamento de Funcionários (Admin/Engenheiro)
- Cadastrar funcionários com CPF único
- Listar todos os funcionários
- Editar informações
- Excluir funcionários
- Definir níveis de permissão

### Gerenciamento de Testes (Admin/Engenheiro)
- Registrar testes de qualidade
- Listar todos os testes
- Filtrar testes por aeronave
- Registrar resultados (Aprovado/Reprovado)

### Geração de Relatórios (Admin/Engenheiro)
- Gerar relatórios completos de produção
- Visualizar relatório formatado na tela
- Exportar relatório em formato TXT
- Histórico de relatórios gerados

### Métricas de Performance
- Coleta automática de latência
- Medição de tempo de resposta
- Cálculo de tempo de processamento
- Endpoints para análise e comparação

## Como Executar

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



## Compatibilidade

Testado e funcional em:
- Windows 10/11
- Ubuntu 24.04.03 LTS
- Distribuições derivadas do Ubuntu