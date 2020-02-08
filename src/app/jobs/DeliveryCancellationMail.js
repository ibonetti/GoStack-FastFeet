import Mail from '../../lib/Mail';

class DeliveryCancellationMail{
  get key(){
    return 'DeliveryCancellationMail';
  }

  async handle({data}){
    const { deliveryDet, deliveryProblem } = data;

    await Mail.sendMail({
      to: `${deliveryDet.deliveryman.name} <${deliveryDet.deliveryman.email}>`,
      subject: 'Encomenda Cancelada',
      template: 'deliverycanceled',
      context: {
        deliveryman: deliveryDet.deliveryman.name,
        delivery: deliveryDet.id,
        product: deliveryDet.product,
        recipient: deliveryDet.recipient.name,
        problem: deliveryProblem.description,
        address: `${deliveryDet.recipient.street}, ${deliveryDet.recipient.number}
                    - ${deliveryDet.recipient.city}/${deliveryDet.recipient.state}`,
      },
    });
  }
}

export default new DeliveryCancellationMail();
