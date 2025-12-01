import { Request, Response, NextFunction } from 'express'
import prisma from '../db'

interface MetricData {
  startTime: number
  startMemory: number
}

declare global {
  namespace Express {
    interface Request {
      metricData?: MetricData
    }
  }
}

export const metricsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  const startMemory = process.memoryUsage().heapUsed

  req.metricData = { startTime, startMemory }

  res.on('finish', async () => {
    try {
      const endTime = Date.now()
      const latency = endTime - startTime
      
      const responseTime = latency
      
      const processingTime = latency * 0.7 

      if (req.path.startsWith('/api/metrics')) {
        return
      }

      await prisma.metric.create({
        data: {
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          latency,
          responseTime,
          processingTime,
          userCount: 1, 
        },
      })
    } catch (error) {
      console.error('Erro ao salvar métrica:', error)
    }
  })

  next()
}
