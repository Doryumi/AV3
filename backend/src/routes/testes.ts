import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const testes = await prisma.teste.findMany({
      include: {
        funcionario: {
          select: {
            cpf: true,
            nome: true,
          },
        },
        aeronave: true,
      },
    })
    res.json(testes)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar testes' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const teste = await prisma.teste.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        funcionario: {
          select: {
            cpf: true,
            nome: true,
          },
        },
        aeronave: true,
      },
    })
    
    if (!teste) {
      return res.status(404).json({ error: 'Teste não encontrado' })
    }
    
    res.json(teste)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar teste' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { tipo, descricao, resultado, data, funcionarioCpf, codigoAeronave } = req.body

    if (!tipo || !descricao || !resultado || !data || !funcionarioCpf || !codigoAeronave) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { cpf: funcionarioCpf },
    })

    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' })
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave },
    })

    if (!aeronave) {
      return res.status(404).json({ error: 'Aeronave não encontrada' })
    }

    const teste = await prisma.teste.create({
      data: {
        tipo,
        descricao,
        resultado,
        data: new Date(data),
        funcionarioCpf,
        codigoAeronave,
      },
      include: {
        funcionario: {
          select: {
            cpf: true,
            nome: true,
          },
        },
        aeronave: true,
      },
    })

    res.status(201).json(teste)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar teste' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { descricao, resultado, data, funcionarioCpf, codigoAeronave } = req.body

    const teste = await prisma.teste.update({
      where: { id: Number(req.params.id) },
      data: {
        descricao,
        resultado,
        data: data ? new Date(data) : undefined,
        funcionarioCpf,
        codigoAeronave,
      },
      include: {
        funcionario: {
          select: {
            cpf: true,
            nome: true,
          },
        },
        aeronave: true,
      },
    })

    res.json(teste)
  } catch (error) {
    res.status(404).json({ error: 'Teste não encontrado' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.teste.delete({
      where: { id: Number(req.params.id) },
    })

    res.json({ message: 'Teste excluído com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Teste não encontrado' })
  }
})

export default router
