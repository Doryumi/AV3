import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      select: {
        cpf: true,
        nome: true,
        usuario: true,
        nivelPermissao: true,
      },
    })
    res.json(funcionarios)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionários' })
  }
})
router.get('/:cpf', async (req: Request, res: Response) => {
  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { cpf: req.params.cpf },
      select: {
        cpf: true,
        nome: true,
        usuario: true,
        nivelPermissao: true,
      },
    })
    
    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' })
    }
    
    res.json(funcionario)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionário' })
  }
})


router.post('/auth', async (req: Request, res: Response) => {
  try {
    const { usuario, senha } = req.body

    if (!usuario || !senha) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios' })
    }

    const funcionario = await prisma.funcionario.findUnique({
      where: { usuario },
    })

    if (!funcionario || funcionario.senha !== senha) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' })
    }

    const { senha: _, ...dadosFuncionario } = funcionario

    res.json(dadosFuncionario)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { cpf, nome, usuario, senha, nivelPermissao } = req.body

    if (!cpf || !nome || !usuario || !senha || nivelPermissao === undefined) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const existente = await prisma.funcionario.findUnique({
      where: { cpf },
    })

    if (existente) {
      return res.status(400).json({ error: 'CPF já cadastrado' })
    }

    const usuarioExistente = await prisma.funcionario.findUnique({
      where: { usuario },
    })

    if (usuarioExistente) {
      return res.status(400).json({ error: 'Usuário já cadastrado' })
    }

    const funcionario = await prisma.funcionario.create({
      data: { cpf, nome, usuario, senha, nivelPermissao },
      select: {
        cpf: true,
        nome: true,
        usuario: true,
        nivelPermissao: true,
      },
    })

    res.status(201).json(funcionario)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar funcionário' })
  }
})

router.put('/:cpf', async (req: Request, res: Response) => {
  try {
    const { nome, usuario, senha, nivelPermissao } = req.body

    const data: any = {}
    if (nome) data.nome = nome
    if (usuario) data.usuario = usuario
    if (senha) data.senha = senha
    if (nivelPermissao !== undefined) data.nivelPermissao = nivelPermissao

    const funcionario = await prisma.funcionario.update({
      where: { cpf: req.params.cpf },
      data,
      select: {
        cpf: true,
        nome: true,
        nivelPermissao: true,
      },
    })

    res.json(funcionario)
  } catch (error) {
    res.status(404).json({ error: 'Funcionário não encontrado' })
  }
})

router.delete('/:cpf', async (req: Request, res: Response) => {
  try {
    await prisma.funcionario.delete({
      where: { cpf: req.params.cpf },
    })

    res.json({ message: 'Funcionário excluído com sucesso' })
  } catch (error) {
    res.status(404).json({ error: 'Funcionário não encontrado' })
  }
})

export default router
