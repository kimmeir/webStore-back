import type { Request, Response } from 'express';
import { AddressModel } from '../models/user.model';

class AddressController {
  public async getAddress(req: Request, res: Response) {
    try {
      const address = await AddressModel.findOne({ where: { id: req.params.id } });

      if (!address)
        res.status(404).json({ message: 'Address not found' });

      res.json(address);
    } catch (error: Error | any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async createAddress(req: Request, res: Response) {
    try {
      const address = await AddressModel.create(req.body);

      res.status(201).json(address);
    } catch (error: Error | any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async updateAddress(req: Request, res: Response) {
    try {
      const address = await AddressModel.update(req.body, { where: { id: req.params.id } });

      res.status(200).json(address);
    } catch (error: Error | any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async deleteAddress(req: Request, res: Response) {
    try {
      await AddressModel.destroy({ where: { id: req.params.id } });

      res.status(204).end();
    } catch (error: Error | any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new AddressController();
