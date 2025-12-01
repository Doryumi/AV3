import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const pecas = await prisma.peca.findMany({
      include: { aeronave: true },
    })
    res.json(pecas)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar peças' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const peca = await prisma.peca.findUnique({
      where: { id: Number(req.params.id) },
      include: { aeronave: true },
    })
    
    if (!peca) {
      return res.status(404).json({ error: 'Peça não encontrada' })
    }
    
    res.json(peca)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar peça' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, tipo, fornecedor, codigoAeronave } = req.body

    if (!nome || !tipo || !fornecedor || !codigoAeronave) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave },
    })

    if (!aeronave) {
      return res.status(404).json({ error: 'Aeronave não encontrada' })
    }

    const existente = await prisma.peca.findFirst({
      where: {
        nome,
        codigoAeronave,
      },
    })

    if (existente) {
      return res.status(400).json({ error: 'Peça já cadastrada para esta aeronave' })
    }

    const peca = await prisma.peca.create({
      data: {
        nome,
        tipo,
        fornecedor,
        codigoAeronave,
        status: 'Em Produção',
      },
      include: { aeronave: true },
    })

    res.status(201).json(peca)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar peça' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { nome, tipo, fornecedor, codigoAeronave } = req.body

    const peca = await prisma.peca.update({
      where: { id: Number(req.params.id) },
      data: { nome, tipo, fornecedor, codigoAeronave },
      include: { aeronave: true },
    })

    res.json(peca)
  } catch (error) {
    res.status(404).json({ error: 'Peça não encontrada' })
  }
})

router.patch('/:id/avancar-status', async (req: Request, res: Response) => {
  try {
    const peca = await prisma.peca.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!peca) {
      return res.status(404).json({ error: 'Peça não encontrada' })
    }

    let novoStatus: string
    
    if (peca.status === 'Em Produção') {
      novoStatus = 'Em Transporte'
    } else if (peca.status === 'Em Transporte') {
      novoStatus = 'Pronta'
    } else {
      return res.status(400).json({ error: 'Peça já está no status final' })
    }

    const pecaAtualizada = await prisma.peca.update({
      where: { id: Number(req.params.id) },
      data: { status: novoStatus },
      include: { aeronave: true },
    })

    res.json(pecaAtualizada)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao avançar status' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.peca.delete({
      where: { id: Number(req.params.id) },
    })

    res.json({ message: 'Peça excluída com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Peça não encontrada' })
  }
})

export default router
