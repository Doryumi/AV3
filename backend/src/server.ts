import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { metricsMiddleware } from './middleware/metrics'
import aeronaveRoutes from './routes/aeronaves'
import pecaRoutes from './routes/pecas'
import etapaRoutes from './routes/etapas'
import funcionarioRoutes from './routes/funcionarios'
import testeRoutes from './routes/testes'
import relatorioRoutes from './routes/relatorios'
import metricRoutes from './routes/metrics'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(metricsMiddleware)

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/aeronaves', aeronaveRoutes)
app.use('/api/pecas', pecaRoutes)
app.use('/api/etapas', etapaRoutes)
app.use('/api/funcionarios', funcionarioRoutes)
app.use('/api/testes', testeRoutes)
app.use('/api/relatorios', relatorioRoutes)
app.use('/api/metrics', metricRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`)
})
