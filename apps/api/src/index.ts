import 'dotenv/config';
import dotenvExpand from 'dotenv-expand';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { setupOpenAPI } from './openapi';
import mediaRouter from './routes/media';
import authRouter from './routes/auth';

dotenvExpand.expand({ parsed: process.env as any });

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

setupOpenAPI(app);

app.use('/api/media', mediaRouter);
app.use('/api/auth', authRouter);

const PORT = Number(process.env.API_PORT || 4000);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`api listening on :${PORT}`);
});


