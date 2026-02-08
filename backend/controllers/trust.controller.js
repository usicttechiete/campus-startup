import {
  createEndorsement,
} from '../services/trust.service.js';

const endorsePeerController = async (req, res) => {
  try {
    const { targetUserId, rating } = req.body;
    const endorsement = await createEndorsement(req.user.id, targetUserId, rating);
    res.status(201).json(endorsement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  endorsePeerController,
};
