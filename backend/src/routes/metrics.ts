import { Router, Request, Response } from 'express'
import prisma from '../db'

const router = Router()

router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { userCount } = req.query
    const filter = userCount ? { userCount: Number(userCount) } : {}

    const metrics = await prisma.metric.findMany({
      where: filter,
      orderBy: { timestamp: 'desc' },
      take: 1000,
    })

    if (metrics.length === 0) {
      return res.json({
        count: 0,
        avgLatency: 0,
        avgResponseTime: 0,
        avgProcessingTime: 0,
        minLatency: 0,
        maxLatency: 0,
      })
    }

    const summary = {
      count: metrics.length,
      avgLatency: metrics.reduce((acc: number, m: any) => acc + m.latency, 0) / metrics.length,
      avgResponseTime: metrics.reduce((acc: number, m: any) => acc + m.responseTime, 0) / metrics.length,
      avgProcessingTime: metrics.reduce((acc: number, m: any) => acc + m.processingTime, 0) / metrics.length,
      minLatency: Math.min(...metrics.map((m: any) => m.latency)),
      maxLatency: Math.max(...metrics.map((m: any) => m.latency)),
      byEndpoint: {} as Record<string, any>,
    }

    const endpointGroups: Record<string, typeof metrics> = {}
    metrics.forEach((m: any) => {
      if (!endpointGroups[m.endpoint]) {
        endpointGroups[m.endpoint] = []
      }
      endpointGroups[m.endpoint].push(m)
    })

    Object.keys(endpointGroups).forEach(endpoint => {
      const group = endpointGroups[endpoint]
      summary.byEndpoint[endpoint] = {
        count: group.length,
        avgLatency: group.reduce((acc: number, m: any) => acc + m.latency, 0) / group.length,
        avgResponseTime: group.reduce((acc: number, m: any) => acc + m.responseTime, 0) / group.length,
        avgProcessingTime: group.reduce((acc: number, m: any) => acc + m.processingTime, 0) / group.length,
      }
    })

    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar métricas' })
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const { userCount, limit = '100' } = req.query
    const filter = userCount ? { userCount: Number(userCount) } : {}

    const metrics = await prisma.metric.findMany({
      where: filter,
      orderBy: { timestamp: 'desc' },
      take: Number(limit),
    })

    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar métricas' })
  }
})

router.get('/compare', async (req: Request, res: Response) => {
  try {
    const comparisons = []

    for (const userCount of [1, 5, 10]) {
      const metrics = await prisma.metric.findMany({
        where: { userCount },
        orderBy: { timestamp: 'desc' },
        take: 100,
      })

      if (metrics.length > 0) {
        comparisons.push({
          userCount,
          count: metrics.length,
          avgLatency: metrics.reduce((acc: number, m: any) => acc + m.latency, 0) / metrics.length,
          avgResponseTime: metrics.reduce((acc: number, m: any) => acc + m.responseTime, 0) / metrics.length,
          avgProcessingTime: metrics.reduce((acc: number, m: any) => acc + m.processingTime, 0) / metrics.length,
          minLatency: Math.min(...metrics.map((m: any) => m.latency)),
          maxLatency: Math.max(...metrics.map((m: any) => m.latency)),
        })
      }
    }

    res.json(comparisons)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao comparar métricas' })
  }
})

router.delete('/cleanup', async (req: Request, res: Response) => {
  try {
    const { days = '7' } = req.query
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - Number(days))

    const result = await prisma.metric.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate,
        },
      },
    })

    res.json({ message: `${result.count} métricas removidas` })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao limpar métricas' })
  }
})

export default router
