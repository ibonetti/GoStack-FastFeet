import Mail from '../../lib/Mail';

class NewDeliveryMail{
  get key(){
    return 'NewDeliveryMail';
  }

  async handle({data}){
    const { deliveryDet } = data;

    await Mail.sendMail({
      to: `${deliveryDet.deliveryman.name} <${deliveryDet.deliveryman.email}>`,
      subject: 'Nova encomenda aguardando retirada!',
      template: 'newdelivery',
      context: {
        deliveryman: deliveryDet.deliveryman.name,
        product: deliveryDet.product,
        recipient: deliveryDet.recipient.name,
        address: `${deliveryDet.recipient.street}, ${deliveryDet.recipient.number}
                    - ${deliveryDet.recipient.city}/${deliveryDet.recipient.state}`,
      },
    });
  }
}

export default new NewDeliveryMail();
