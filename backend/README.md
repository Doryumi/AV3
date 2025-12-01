# Aerocode Backend

Sistema de gerenciamento de produção de aeronaves com Node.js + TypeScript + Prisma + MySQL.

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **MySQL** 8.0 ou superior
- **npm** ou **yarn**

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar banco de dados

Edite o arquivo `.env` com suas credenciais do MySQL:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode"
PORT=3001
NODE_ENV=development
```

### 3. Criar banco de dados

```bash
# No MySQL
CREATE DATABASE aerocode;
```

### 4. Executar migrations

```bash
npm run prisma:push
```

### 5. Popular banco de dados (seed)

```bash
npm run seed
```

Isso criará:
- 3 funcionários padrão (admin, engenheiro, operador)
- 2 aeronaves de exemplo
- Peças, etapas e testes de demonstração

## 🎮 Executar

### Modo desenvolvimento (com hot reload)

```bash
npm run dev
```

### Modo produção

```bash
npm run build
npm start
```

O servidor estará disponível em: `http://localhost:3001`

## 📊 Endpoints da API

### Health Check
- `GET /health` - Verifica status do servidor

### Funcionários
- `GET /api/funcionarios` - Listar todos
- `GET /api/funcionarios/:cpf` - Buscar por CPF
- `POST /api/funcionarios/auth` - Autenticar
- `POST /api/funcionarios` - Criar
- `PUT /api/funcionarios/:cpf` - Atualizar
- `DELETE /api/funcionarios/:cpf` - Excluir

### Aeronaves
- `GET /api/aeronaves` - Listar todas
- `GET /api/aeronaves/:codigo` - Buscar por código
- `POST /api/aeronaves` - Criar
- `PUT /api/aeronaves/:codigo` - Atualizar
- `DELETE /api/aeronaves/:codigo` - Excluir

### Peças
- `GET /api/pecas` - Listar todas
- `GET /api/pecas/:id` - Buscar por ID
- `POST /api/pecas` - Criar
- `PUT /api/pecas/:id` - Atualizar
- `PATCH /api/pecas/:id/avancar-status` - Avançar status
- `DELETE /api/pecas/:id` - Excluir

### Etapas
- `GET /api/etapas` - Listar todas
- `GET /api/etapas/:id` - Buscar por ID
- `POST /api/etapas` - Criar
- `PUT /api/etapas/:id` - Atualizar
- `PATCH /api/etapas/:id/iniciar` - Iniciar etapa
- `PATCH /api/etapas/:id/finalizar` - Finalizar etapa
- `POST /api/etapas/:id/funcionarios` - Associar funcionário
- `DELETE /api/etapas/:id/funcionarios/:cpf` - Desassociar funcionário
- `DELETE /api/etapas/:id` - Excluir

### Testes
- `GET /api/testes` - Listar todos
- `GET /api/testes/:id` - Buscar por ID
- `POST /api/testes` - Criar
- `PUT /api/testes/:id` - Atualizar
- `DELETE /api/testes/:id` - Excluir

### Relatórios
- `GET /api/relatorios` - Listar todos
- `GET /api/relatorios/:id` - Buscar por ID
- `POST /api/relatorios/gerar` - Gerar relatório
- `DELETE /api/relatorios/:id` - Excluir

### Métricas de Performance
- `GET /api/metrics` - Listar métricas detalhadas
- `GET /api/metrics/summary` - Resumo agregado
- `GET /api/metrics/compare` - Comparar por número de usuários
- `DELETE /api/metrics/cleanup` - Limpar métricas antigas

## 📈 Métricas de Performance

O sistema registra automaticamente três métricas para cada requisição:

1. **Latência**: Tempo total desde o recebimento até o envio da resposta
2. **Tempo de Resposta**: Igual à latência (tempo total do ciclo)
3. **Tempo de Processamento**: Estimativa do tempo de CPU (70% da latência)

### Como funciona

Um middleware intercepta todas as requisições e:
- Marca o timestamp inicial
- Calcula o tempo ao finalizar
- Salva no banco de dados (tabela `metrics`)

### Consultar métricas

```bash
# Resumo geral
curl http://localhost:3001/api/metrics/summary

# Filtrar por número de usuários
curl http://localhost:3001/api/metrics/summary?userCount=5

# Comparar cenários (1, 5 e 10 usuários)
curl http://localhost:3001/api/metrics/compare
```

### Simular carga

Para testar com múltiplos usuários, use ferramentas como:
- **Apache Bench (ab)**
- **wrk**
- **k6**
- **Artillery**

Exemplo com Apache Bench:
```bash
# 100 requisições, 5 concorrentes
ab -n 100 -c 5 http://localhost:3001/api/aeronaves
```

## 🗄️ Estrutura do Banco

- **funcionarios** - Usuários do sistema
- **aeronaves** - Modelos de aeronaves
- **pecas** - Peças e componentes
- **etapas** - Etapas de produção
- **etapas_funcionarios** - Relacionamento N:N
- **testes** - Testes de qualidade
- **relatorios** - Relatórios gerados
- **metrics** - Métricas de performance

## 🛠️ Comandos Prisma

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Criar migration
npm run prisma:migrate

# Push schema (sem migration)
npm run prisma:push

# Abrir Prisma Studio
npm run prisma:studio
```

## 🐳 Docker (Opcional)

```bash
# Subir MySQL com Docker
docker run --name aerocode-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=aerocode \
  -p 3306:3306 \
  -d mysql:8.0
```

## 🔧 Troubleshooting

### Erro de conexão com MySQL

Verifique se:
1. MySQL está rodando
2. Credenciais em `.env` estão corretas
3. Banco de dados existe
4. Firewall permite conexão na porta 3306

### Erro "Table doesn't exist"

Execute:
```bash
npm run prisma:push
```

### Limpar e reiniciar

```bash
# Remover banco
DROP DATABASE aerocode;
CREATE DATABASE aerocode;

# Recriar estrutura
npm run prisma:push
npm run seed
```

## 📝 Usuários Padrão (após seed)

| Usuário | CPF | Senha | Nível |
|---------|-----|-------|-------|
| Administrador | 000.000.000-00 | admin | Admin (1) |
| Engenheiro | 111.111.111-11 | eng123 | Engenheiro (2) |
| Operador | 222.222.222-22 | oper123 | Operador (3) |

## 🌍 Compatibilidade

Testado em:
- ✅ Windows 10/11
- ✅ Ubuntu 24.04
- ✅ macOS

## 📚 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **Prisma** - ORM moderno
- **MySQL** - Banco de dados relacional
- **tsx** - Executar TypeScript diretamente

## 📄 Licença

ISC
