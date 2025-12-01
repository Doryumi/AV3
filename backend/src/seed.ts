import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  console.log('Iniciando seed do banco de dados...')

  await prisma.metric.deleteMany()
  await prisma.teste.deleteMany()
  await prisma.etapaFuncionario.deleteMany()
  await prisma.etapa.deleteMany()
  await prisma.peca.deleteMany()
  await prisma.aeronave.deleteMany()
  await prisma.relatorio.deleteMany()
  await prisma.funcionario.deleteMany()

  console.log('Dados existentes removidos')

  const funcionarios = await Promise.all([
    prisma.funcionario.create({
      data: {
        cpf: '000.000.000-00',
        nome: 'Administrador',
        usuario: 'admin',
        senha: 'admin',
        nivelPermissao: 1, 
      },
    }),
    prisma.funcionario.create({
      data: {
        cpf: '111.111.111-11',
        nome: 'Engenheiro',
        usuario: 'engenheiro',
        senha: 'eng123',
        nivelPermissao: 2, 
      },
    }),
    prisma.funcionario.create({
      data: {
        cpf: '222.222.222-22',
        nome: 'Operador',
        usuario: 'operador',
        senha: 'oper123',
        nivelPermissao: 3,
      },
    }),
  ])

  console.log('Funcionários criados')

  const aeronaves = await Promise.all([
    prisma.aeronave.create({
      data: {
        codigo: 'AER-001',
        modelo: 'Boeing 737-800',
        tipo: 'Comercial',
        capacidade: 180,
        alcance: 5500,
      },
    }),
    prisma.aeronave.create({
      data: {
        codigo: 'AER-002',
        modelo: 'Embraer E195',
        tipo: 'Comercial',
        capacidade: 124,
        alcance: 3900,
      },
    }),
  ])

  console.log('Aeronaves criadas')

  await Promise.all([
    prisma.peca.create({
      data: {
        nome: 'Motor Turbo',
        tipo: 'Nacional',
        fornecedor: 'Rolls-Royce',
        status: 'Em Produção',
        codigoAeronave: 'AER-001',
      },
    }),
    prisma.peca.create({
      data: {
        nome: 'Trem de Pouso',
        tipo: 'Importada',
        fornecedor: 'Boeing Parts',
        status: 'Em Transporte',
        codigoAeronave: 'AER-001',
      },
    }),
  ])

  console.log('Peças criadas')

  const etapa1 = await prisma.etapa.create({
    data: {
      nome: 'Montagem da Fuselagem',
      prazo: new Date('2025-12-31'),
      status: 'Pendente',
      codigoAeronave: 'AER-001',
    },
  })

  const etapa2 = await prisma.etapa.create({
    data: {
      nome: 'Instalação de Motores',
      prazo: new Date('2026-01-15'),
      status: 'Em Andamento',
      codigoAeronave: 'AER-001',
    },
  })

  console.log('Etapas criadas')

  await Promise.all([
    prisma.etapaFuncionario.create({
      data: {
        etapaId: etapa1.id,
        funcionarioCpf: '222.222.222-22',
      },
    }),
    prisma.etapaFuncionario.create({
      data: {
        etapaId: etapa2.id,
        funcionarioCpf: '111.111.111-11',
      },
    }),
  ])

  console.log('✅ Funcionários associados às etapas')

  await Promise.all([
    prisma.teste.create({
      data: {
        tipo: 'Elétrico',
        descricao: 'Teste de resistência da fuselagem',
        resultado: 'Aprovado',
        data: new Date('2025-11-15'),
        funcionarioCpf: '111.111.111-11',
        codigoAeronave: 'AER-001',
      },
    }),
    prisma.teste.create({
      data: {
        tipo: 'Hidráulico',
        descricao: 'Teste de pressurização da cabine',
        resultado: 'Aprovado',
        data: new Date('2025-11-20'),
        funcionarioCpf: '111.111.111-11',
        codigoAeronave: 'AER-001',
      },
    }),
  ])

  console.log('Testes criados')

  console.log('Seed concluído com sucesso!')
}

seed()
  .catch((e) => {
    console.error('Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
