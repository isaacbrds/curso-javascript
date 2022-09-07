import { Router, Response, Request } from 'express';
import {CreateSpecificationService} from '../modules/cars/services/CreateSpecificationService';
import { SpecificationsRepository } from '../modules/cars/repositories/SpecificationsRepository';

const specificationsRoutes = Router();
const specificationsRepository = new SpecificationsRepository();

specificationsRoutes.post('/', (req: Request, res: Response)=>{
  const {name, description} = req.body

  const createSpecificationService = 
  new CreateSpecificationService(specificationsRepository);

  createSpecificationService.execute({ name, description });

  return res.status(201).send();
})

export { specificationsRoutes }