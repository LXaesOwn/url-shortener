import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import statsRoutes from './routes/statsRoutes';
import { CONSTANTS } from './config/constants';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CONSTANTS.API_PREFIX, urlRoutes);
app.use(CONSTANTS.API_PREFIX, statsRoutes);

app.get('/health', (req, res) => {
  res.status(CONSTANTS.HTTP_STATUS.OK).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
