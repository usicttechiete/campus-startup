const hiringService = require('../services/hiring.service');

const postJobController = async (req, res) => {
  try {
    // Assuming company_id is the user's id if they are an admin
    const newJob = await hiringService.createJob(req.user.id, req.body);
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getJobsController = async (req, res) => {
  try {
    // Fetch jobs created by the current admin/company user
    const jobs = await hiringService.getJobsByCompanyId(req.user.id);
    res.status(200).json({ results: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicantsController = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const applicants = await hiringService.getApplicantsForJob(jobId);
    res.status(200).json({ results: applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatusController = async (req, res) => {
  try {
    const { id: applicationId } = req.params;
    const { status } = req.body;
    const updatedApplication = await hiringService.updateApplication(applicationId, status);
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postJobController,
  getJobsController,
  getApplicantsController,
  updateApplicationStatusController,
};
