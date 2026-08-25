import { Router } from 'express';
import { recommendPlants } from '../../../../lib/catalogue-service.js';

export const recommendationsRouter = Router();
recommendationsRouter.post('/', (request, response) => response.json({ data: recommendPlants(request.body), methodology: 'rule-based-v1' }));
