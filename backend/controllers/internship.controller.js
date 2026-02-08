import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getApplicantsForJob,
  getUserApplications,
  updateApplication,
} from '../services/hiring.service.js';

const getInternshipsController = async (req, res) => {
  try {
    // Re-using the getJobs service, filtering for internships
    const internships = await getJobs({ ...req.query, type: 'Internship' });
    res.status(200).json({ results: internships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInternshipByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await getJobById(id);
    if (!internship || internship.type !== 'Internship') {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.status(200).json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyToInternshipController = async (req, res) => {
  try {
    const { id: internshipId } = req.params;
    const result = await applyForJob(internshipId, req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyApplicationsController = async (req, res) => {
  try {
    console.log('getMyApplicationsController: user', req.user.id);
    const applications = await getUserApplications(req.user.id);
    console.log('getMyApplicationsController: results count', applications?.length);
    res.status(200).json({ results: applications });
  } catch (error) {
    console.error('getMyApplicationsController error:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  getInternshipsController,
  getInternshipByIdController,
  applyToInternshipController,
  getMyApplicationsController,
};
