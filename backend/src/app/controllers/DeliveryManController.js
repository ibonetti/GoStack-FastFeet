import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController{
  async index(req, res){
    const deliveryMen = await DeliveryMan.findAll({
      where : {
        inactive: false,
      },
      attributes: ['name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
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
    const { name, email, avatar_id } = deliveryMan;


    return res.json({name, email, avatar_id});
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
