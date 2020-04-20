import Delivery from '../models/Delivery';
import File from '../models/File';

class EndDeliveryController{
  async store(req, res){
    const { id, deliveryid } = req.params;
    const { signatureId } = req.body;

    const delivery = await Delivery.findByPk(deliveryid);

    if (!delivery){
      return res.status(400).json({ error: 'Delivery not found!'});
    }

    if (delivery.deliveryman_id != id){
      return res.status(401).json({ error: "This delivery doesn't belong to you!"});
    }

    if (!delivery.start_date || delivery.start_date === 0){
      return res.status(401).json({ error: 'Delivery has not been taken, you need to pick it up first!'});
    }

    if (delivery.end_date > 0){
      return res.status(401).json({error: 'Delivery is already delivered!!!'});
    }

    if (signatureId && signatureId > 0){
      const signature = await File.findByPk(signatureId);
      if (!signature){
        return res.status(400).json({ error: "Signature image not found for de given Id! "});
      }
    }

    delivery.end_date = new Date();
    delivery.signature_id = signatureId;
    await delivery.save();

    return res.json(delivery);
  }
}

export default new EndDeliveryController();
