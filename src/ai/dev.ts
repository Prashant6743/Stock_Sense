import { config } from 'dotenv';
config();

import '@/ai/flows/price-prediction.ts';
import '@/ai/flows/stock-data-retrieval.ts';
import '@/ai/flows/ticker-retrieval.ts';
