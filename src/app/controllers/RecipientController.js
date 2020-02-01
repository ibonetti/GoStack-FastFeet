
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    return res.json(await Recipient.findAll());
  }

  async store(req, res){
    const { name } = req.body;

    const recpExists = await Recipient.findOne({
      where: { name }
    });

    if (recpExists){
      res.statatus(400).json({ error : 'Recipient already exists!!!'});
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);

  }

  async update(req, res) {
    const recipientExists = await Recipient.findByPk(req.params.id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient not found!' });
    }

    const recipient = await recipientExists.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
