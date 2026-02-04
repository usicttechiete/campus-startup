const Startup = require('../models/startup');

const listStartups = async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status).trim().toUpperCase() : 'PENDING';

    const valid = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }

    const startups = await Startup.findByStatus(status);
    res.status(200).json({ results: startups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveStartup = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Startup id is required' });
    }

    const updated = await Startup.update(id, {
      status: 'APPROVED',
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
      reapply_after: null,
    });

    res.status(200).json({ success: true, startup: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Startup id is required' });
    }

    const reason = String(rejection_reason || '').trim();
    if (!reason) {
      return res.status(400).json({ message: 'rejection_reason is required' });
    }

    const now = new Date();
    const reapplyAfter = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const updated = await Startup.update(id, {
      status: 'REJECTED',
      reviewed_at: now.toISOString(),
      rejection_reason: reason,
      reapply_after: reapplyAfter.toISOString(),
    });

    res.status(200).json({ success: true, startup: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listStartups,
  approveStartup,
  rejectStartup,
};
