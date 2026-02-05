const Startup = require('../models/startup');
const supabase = require('../config/db');

const normalizeStage = (stage) => {
  if (!stage) return stage;
  const normalized = String(stage).trim().toUpperCase();
  if (normalized === 'IDEA') return 'IDEA';
  if (normalized === 'MVP') return 'MVP';
  if (normalized === 'SCALING') return 'SCALING';
  return stage;
};

const getUserRole = async (userId) => {
  const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
  if (error) {
    throw new Error('Failed to fetch user role');
  }
  return data?.role;
};

const createStartup = async (req, res) => {
  try {
    const {
      name,
      problem,
      problem_statement,
      domain,
      stage,
      total_members,
      head_name,
      head_email,
      revenue,
      is_revenue,
      active,
      is_active
    } = req.body;

    const role = await getUserRole(req.user.id);
    if (role !== 'student') {
      return res.status(403).json({ message: 'Only students can create a startup.' });
    }

    const previous = await Startup.findLatestByUserId(req.user.id);
    if (previous?.status === 'PENDING' || previous?.status === 'APPROVED') {
      return res.status(409).json({ message: 'You already have a startup application in progress.' });
    }
    if (previous?.status === 'REJECTED' && previous?.reapply_after) {
      const reapplyDate = new Date(previous.reapply_after);
      if (!Number.isNaN(reapplyDate.getTime()) && new Date() <= reapplyDate) {
        return res.status(403).json({
          message: `You can reapply after ${reapplyDate.toISOString()}.`,
          status: 'REJECTED',
          reapply_after: previous.reapply_after,
        });
      }
    }

    const finalProblem = (problem ?? problem_statement ?? '').trim();
    const finalStage = normalizeStage(stage);
    const finalActive = Boolean(active ?? is_active);

    const hasRequired = name && finalProblem && domain && finalStage && head_name && head_email;

    if (!hasRequired) {
      return res.status(400).json({
        message: 'Required fields missing'
      });
    }

    if (!finalActive) {
      return res.status(400).json({
        message: 'Active startup must be set to Yes to submit an application.'
      });
    }

    const startup = await Startup.create({
      user_id: req.user.id,
      name: String(name).trim(),
      problem: finalProblem,
      domain: String(domain).trim(),
      stage: finalStage,
      total_members: total_members === '' || total_members === null || total_members === undefined ? null : Number(total_members),
      head_name: String(head_name).trim(),
      head_email: String(head_email).trim(),
      revenue: Boolean(revenue ?? is_revenue),
      active: finalActive,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      status: 'PENDING',
      message: 'Application submitted. Please stay tuned for updates.',
      startup_id: startup?.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findLatestByUserId(req.user.id);

    if (!startup) {
      return res.status(200).json({ success: true, message: 'No startup to delete.' });
    }

    await Startup.remove(startup.id);
    return res.status(200).json({ success: true, message: 'Startup deactivated.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findLatestByUserId(req.user.id);

    if (!startup) {
      return res.status(200).json(null);
    }

    if (startup.status === 'PENDING') {
      return res.status(200).json({
        status: 'PENDING',
        message: 'Application submitted. Please stay tuned for updates.',
      });
    }

    if (startup.status === 'REJECTED') {
      return res.status(200).json({
        status: 'REJECTED',
        message: startup.rejection_reason
          ? `Your application was denied: ${startup.rejection_reason}`
          : 'Your application was denied. You can reapply after the cooldown period.',
        rejection_reason: startup.rejection_reason || null,
        reapply_after: startup.reapply_after || null,
      });
    }

    return res.status(200).json({
      status: 'APPROVED',
      startup,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getStartupById = async (req, res) => {
  try {
    const { id: startupId } = req.params;
    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json(startup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStartup,
  getMyStartup,
  getStartupById,
  deleteMyStartup,
};
