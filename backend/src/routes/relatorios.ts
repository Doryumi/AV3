import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const relatorios = await prisma.relatorio.findMany({
      orderBy: { dataGeracao: 'desc' },
    })
    res.json(relatorios)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatórios' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const relatorio = await prisma.relatorio.findUnique({
      where: { id: Number(req.params.id) },
    })
    
    if (!relatorio) {
      return res.status(404).json({ error: 'Relatório não encontrado' })
    }
    
    res.json(relatorio)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatório' })
  }
})

router.post('/gerar', async (req: Request, res: Response) => {
  try {
    const { cliente, dataEntrega, codigoAeronave } = req.body

    if (!cliente || !dataEntrega || !codigoAeronave) {
      return res.status(400).json({ error: 'Cliente, data de entrega e aeronave são obrigatórios' })
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave }
    })

    if (!aeronave) {
      return res.status(404).json({ error: 'Aeronave não encontrada' })
    }

    let conteudo = `RELATÓRIO FINAL DE ENTREGA\n`
    conteudo += `========================\n\n`
    conteudo += `Cliente: ${cliente}\n`
    conteudo += `Data de Entrega: ${dataEntrega.split('-').reverse().join('/')}\n`
    conteudo += `Data de Geração: ${new Date().toLocaleString('pt-BR')}\n\n`

    conteudo += `\n--- INFORMAÇÕES DA AERONAVE ---\n`
    conteudo += `Código: ${aeronave.codigo}\n`
    conteudo += `Modelo: ${aeronave.modelo}\n`
    conteudo += `Tipo: ${aeronave.tipo}\n`
    conteudo += `Capacidade: ${aeronave.capacidade} passageiros\n`
    conteudo += `Alcance: ${aeronave.alcance} km\n`

    const etapas = await prisma.etapa.findMany({ 
      where: { codigoAeronave },
      include: { funcionarios: { include: { funcionario: true } } }
    })

    conteudo += `\n--- ETAPAS DE PRODUÇÃO ---\n`
    if (etapas.length === 0) {
      conteudo += `Nenhuma etapa registrada.\n`
    } else {
      etapas.forEach((e: any, index: number) => {
        conteudo += `\n${index + 1}. ${e.nome}\n`
        conteudo += `   Status: ${e.status}\n`
        conteudo += `   Prazo: ${new Date(e.prazo).toLocaleDateString('pt-BR')}\n`
        conteudo += `   Funcionários: ${e.funcionarios.map((f: any) => f.funcionario.nome).join(', ') || 'Nenhum'}\n`
      })
    }

    const pecas = await prisma.peca.findMany({ 
      where: { codigoAeronave }
    })

    conteudo += `\n--- PEÇAS UTILIZADAS ---\n`
    if (pecas.length === 0) {
      conteudo += `Nenhuma peça registrada.\n`
    } else {
      pecas.forEach((p: any, index: number) => {
        conteudo += `\n${index + 1}. ${p.nome}\n`
        conteudo += `   Tipo: ${p.tipo}\n`
        conteudo += `   Fornecedor: ${p.fornecedor}\n`
        conteudo += `   Status: ${p.status}\n`
      })
    }

    const testes = await prisma.teste.findMany({ 
      where: { codigoAeronave },
      include: { funcionario: true }
    })

    conteudo += `\n--- RESULTADOS DOS TESTES ---\n`
    if (testes.length === 0) {
      conteudo += `Nenhum teste registrado.\n`
    } else {
      testes.forEach((t: any, index: number) => {
        conteudo += `\n${index + 1}. Teste ${t.tipo}\n`
        conteudo += `   Descrição: ${t.descricao}\n`
        conteudo += `   Resultado: ${t.resultado}\n`
        conteudo += `   Data: ${new Date(t.data).toLocaleDateString('pt-BR')}\n`
        conteudo += `   Responsável: ${t.funcionario.nome}\n`
      })
    }

    conteudo += `\n\n--- RESUMO ---\n`
    conteudo += `Total de Etapas: ${etapas.length}\n`
    conteudo += `Etapas Concluídas: ${etapas.filter(e => e.status === 'Concluída').length}\n`
    conteudo += `Total de Peças: ${pecas.length}\n`
    conteudo += `Testes Realizados: ${testes.length}\n`
    conteudo += `Testes Aprovados: ${testes.filter(t => t.resultado === 'Aprovado').length}\n`

    conteudo += `\n\n========================\n`
    conteudo += `Aeronave pronta para entrega ao cliente.\n`
    conteudo += `Fim do Relatório\n`

    const relatorio = await prisma.relatorio.create({
      data: { 
        cliente,
        dataEntrega: new Date(dataEntrega + 'T00:00:00'),
        codigoAeronave,
        conteudo 
      },
    })

    res.status(201).json(relatorio)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao gerar relatório' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.relatorio.delete({
      where: { id: Number(req.params.id) },
    })

    res.json({ message: 'Relatório excluído com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Relatório não encontrado' })
  }
})

export default router
