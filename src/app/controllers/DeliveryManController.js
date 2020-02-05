import DeliveryMan from '../models/DeliveryMan';
import * as Yup from 'yup';

class DeliveryManController{
  async index(req, res){
    const deliveryMen = await DeliveryMan.findAll({
      where : {
        inactive: false,
      }
    });

    return res.json(deliveryMen);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails ' });
    }

    const deliveryMan = await DeliveryMan.create(req.body);

    return res.json(deliveryMan);
  }

  async delete(req, res){
    const { id } = req.params;
    const deliveryMan = await DeliveryMan.findByPk(id);
    deliveryMan.inactive = true;
    deliveryMan.save();

    return res.json(deliveryMan);
  }
}

export default new DeliveryManController();
