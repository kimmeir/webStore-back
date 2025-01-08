import axios from 'axios';
import type { Request, Response } from 'express';

class NinjasController {
  private ninjaKey = process.env.NINJA_API_KEY;
  private api = axios.create({
    headers: { 'X-Api-Key': this.ninjaKey }
  });

  getJoke = async (req: Request, res: Response) => {
    try {
      const joke = await this.api.get('https://api.api-ninjas.com/v1/jokes')

      if (joke?.data?.[0]?.joke)
        res.status(200).json(joke.data[0].joke)
      else
        res.status(404).json({ message: 'Joke not found' })
    } catch (error: Error | any) {
      res.status(400).json({ message: 'Get joke error ' + error })
    }
  }

  getImage = async (req: Request, res: Response) => {
    try {
      const image = await this.api.get('https://api.api-ninjas.com/v1/randomimage?category=technology')
      const content = { image: image.data }
      res.status(200).json(content)
    } catch
      (error: Error | any) {

    }
  }
}

export default new NinjasController();
