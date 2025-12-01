import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const etapas = await prisma.etapa.findMany({
      include: {
        aeronave: true,
        funcionarios: {
          include: {
            funcionario: true,
          },
        },
      },
    })
    
    const etapasFormatadas = etapas.map((etapa: any) => ({
      ...etapa,
      funcionarios: etapa.funcionarios.map((ef: any) => ef.funcionarioCpf),
    }))
    
    res.json(etapasFormatadas)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar etapas' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const etapa = await prisma.etapa.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        aeronave: true,
        funcionarios: {
          include: {
            funcionario: true,
          },
        },
      },
    })
    
    if (!etapa) {
      return res.status(404).json({ error: 'Etapa não encontrada' })
    }
    
    res.json(etapa)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar etapa' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nome, prazo, codigoAeronave } = req.body

    if (!nome || !prazo || !codigoAeronave) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave },
    })

    if (!aeronave) {
      return res.status(404).json({ error: 'Aeronave não encontrada' })
    }

    const existente = await prisma.etapa.findFirst({
      where: {
        nome,
        codigoAeronave,
      },
    })

    if (existente) {
      return res.status(400).json({ error: 'Etapa já cadastrada para esta aeronave' })
    }

    const etapa = await prisma.etapa.create({
      data: {
        nome,
        prazo: new Date(prazo),
        codigoAeronave,
        status: 'Pendente',
      },
      include: {
        aeronave: true,
        funcionarios: true,
      },
    })

    res.status(201).json({ ...etapa, funcionarios: [] })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar etapa' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { nome, prazo, codigoAeronave } = req.body

    const etapa = await prisma.etapa.update({
      where: { id: Number(req.params.id) },
      data: {
        nome,
        prazo: prazo ? new Date(prazo) : undefined,
        codigoAeronave,
      },
      include: {
        aeronave: true,
        funcionarios: true,
      },
    })

    res.json(etapa)
  } catch (error) {
    res.status(404).json({ error: 'Etapa não encontrada' })
  }
})

router.patch('/:id/iniciar', async (req: Request, res: Response) => {
  try {
    const etapa = await prisma.etapa.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!etapa) {
      return res.status(404).json({ error: 'Etapa não encontrada' })
    }

    if (etapa.status !== 'Pendente') {
      return res.status(400).json({ error: 'Etapa não está pendente' })
    }

    const etapaAtualizada = await prisma.etapa.update({
      where: { id: Number(req.params.id) },
      data: { status: 'Em Andamento' },
      include: {
        aeronave: true,
        funcionarios: true,
      },
    })

    res.json(etapaAtualizada)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao iniciar etapa' })
  }
})

router.patch('/:id/finalizar', async (req: Request, res: Response) => {
  try {
    const etapa = await prisma.etapa.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!etapa) {
      return res.status(404).json({ error: 'Etapa não encontrada' })
    }

    if (etapa.status !== 'Em Andamento') {
      return res.status(400).json({ error: 'Etapa não está em andamento' })
    }

    const etapaAtualizada = await prisma.etapa.update({
      where: { id: Number(req.params.id) },
      data: { status: 'Concluída' },
      include: {
        aeronave: true,
        funcionarios: true,
      },
    })

    res.json(etapaAtualizada)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao finalizar etapa' })
  }
})

router.post('/:id/funcionarios', async (req: Request, res: Response) => {
  try {
    const { cpf } = req.body
    const etapaId = Number(req.params.id)

    if (!cpf) {
      return res.status(400).json({ error: 'CPF não fornecido' })
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { cpf },
    })

    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' })
    }

    const existente = await prisma.etapaFuncionario.findUnique({
      where: {
        etapaId_funcionarioCpf: {
          etapaId,
          funcionarioCpf: cpf,
        },
      },
    })

    if (existente) {
      return res.status(400).json({ error: 'Funcionário já associado a esta etapa' })
    }

    await prisma.etapaFuncionario.create({
      data: {
        etapaId,
        funcionarioCpf: cpf,
      },
    })

    const etapa = await prisma.etapa.findUnique({
      where: { id: etapaId },
      include: {
        aeronave: true,
        funcionarios: {
          include: {
            funcionario: true,
          },
        },
      },
    })

    res.json(etapa)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao associar funcionário' })
  }
})

router.delete('/:id/funcionarios/:cpf', async (req: Request, res: Response) => {
  try {
    const etapaId = Number(req.params.id)
    const cpf = req.params.cpf

    await prisma.etapaFuncionario.delete({
      where: {
        etapaId_funcionarioCpf: {
          etapaId,
          funcionarioCpf: cpf,
        },
      },
    })

    res.json({ message: 'Funcionário desassociado com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Associação não encontrada' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.etapa.delete({
      where: { id: Number(req.params.id) },
    })

    res.json({ message: 'Etapa excluída com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Etapa não encontrada' })
  }
})

export default router
