import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const aeronaves = await prisma.aeronave.findMany({
      include: {
        pecas: true,
        etapas: true,
        testes: true,
      },
    })
    res.json(aeronaves)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aeronaves' })
  }
})

router.get('/:codigo', async (req: Request, res: Response) => {
  try {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: req.params.codigo },
      include: {
        pecas: true,
        etapas: true,
        testes: true,
      },
    })
    
    if (!aeronave) {
      return res.status(404).json({ error: 'Aeronave não encontrada' })
    }
    
    res.json(aeronave)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aeronave' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body

    if (!codigo || !modelo || tipo === undefined || !capacidade || !alcance) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const existente = await prisma.aeronave.findUnique({
      where: { codigo },
    })

    if (existente) {
      return res.status(400).json({ error: 'Código de aeronave já cadastrado' })
    }

    const aeronave = await prisma.aeronave.create({
      data: { codigo, modelo, tipo, capacidade, alcance },
    })

    res.status(201).json(aeronave)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aeronave' })
  }
})

router.put('/:codigo', async (req: Request, res: Response) => {
  try {
    const { modelo, tipo, capacidade, alcance } = req.body

    const aeronave = await prisma.aeronave.update({
      where: { codigo: req.params.codigo },
      data: { modelo, tipo, capacidade, alcance },
    })

    res.json(aeronave)
  } catch (error) {
    res.status(404).json({ error: 'Aeronave não encontrada' })
  }
})

router.delete('/:codigo', async (req: Request, res: Response) => {
  try {
    await prisma.aeronave.delete({
      where: { codigo: req.params.codigo },
    })

    res.json({ message: 'Aeronave excluída com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Aeronave não encontrada' })
  }
})

export default router
