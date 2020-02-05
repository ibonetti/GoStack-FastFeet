import DeliveryMan from '../models/DeliveryMan';
import * as Yup from 'yup';

class DeliveryManController{
  async index(req, res){
    const deliveryMen = await DeliveryMan.findAll({
      where : {
        inactive: false,
      },
      attributes: ['name', 'email']
    });

    return res.json(deliveryMen);
  }

  async store(req, res){
    const deliveryMan = await DeliveryMan.create(req.body);
    const { name, email } = deliveryMan;

    return res.json({name, email});
  }

  async update(req, res){
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    await deliveryMan.update(req.body);
    const { name, email } = deliveryMan;


    return res.json({name, email});
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
