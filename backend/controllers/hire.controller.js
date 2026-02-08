import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getApplicantsForJob,
  getUserApplications,
  updateApplication,
} from '../services/hiring.service.js';

const postJobController = async (req, res) => {
  try {
    // Assuming company_id is the user's id if they are an admin
    const newJob = await createJob(req.user.id, req.body);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplicantsController = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const applicants = await getApplicantsForJob(jobId);
    res.status(200).json({ results: applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatusController = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status } = req.body;
    const updatedApplication = await updateApplication(applicationId, status);
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  postJobController,
  getApplicantsController,
  updateApplicationStatusController,
};
