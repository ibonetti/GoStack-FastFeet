import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    recipient_id: Yup.number().required(),
    deliveryman_id: Yup.number().required(),
    product: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation Fails ' });
  }

  return next();
}
