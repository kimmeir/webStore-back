import { Router } from 'express';
import ninjasController from '../controllers/ninjas.controller';

const router = Router()

router.get('/joke', ninjasController.getJoke)
router.get('/image', ninjasController.getImage)

module.exports = router
