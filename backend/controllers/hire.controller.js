import {
  getJobs,
  getJobsByCompanyId,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getApplicantsForJob,
  getUserApplications,
  updateApplication,
  getAllJobsWithStartups,
} from '../services/hiring.service.js';

const postJobController = async (req, res) => {
  try {
    console.log('postJobController - req.user:', req.user?.id);
    console.log('postJobController - req.approvedStartup:', req.approvedStartup);
    console.log('postJobController - req.body:', req.body);

    // Only approved startups can post jobs
    if (req.isAdmin) {
      return res.status(403).json({ message: 'Admins cannot post jobs. Only approved startups can post jobs.' });
    }

    if (!req.approvedStartup) {
      return res.status(403).json({ message: 'You need an approved startup to post jobs.' });
    }

    const { company_id } = req.body;

    console.log('Comparing company_id:', company_id, 'with approvedStartup.id:', req.approvedStartup.id);

    // Validate that the company_id matches the user's approved startup
    if (company_id !== req.approvedStartup.id) {
      return res.status(403).json({ message: 'You can only post jobs for your own approved startup.' });
    }

    const newJob = await createJob(company_id, req.body);
    res.status(201).json(newJob);
  } catch (error) {
    console.error('postJobController error:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateJobController = async (req, res) => {
  try {
    // Only approved startups can update jobs
    if (req.isAdmin) {
      return res.status(403).json({ message: 'Admins cannot update jobs.' });
    }

    const { id: jobId } = req.params;
    const updatedJob = await updateJob(jobId, req.body, req.approvedStartup?.id);
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJobController = async (req, res) => {
  try {
    // Only approved startups can delete their own jobs
    if (req.isAdmin) {
      return res.status(403).json({ message: 'Admins cannot delete jobs.' });
    }

    if (!req.approvedStartup) {
      return res.status(403).json({ message: 'You need an approved startup to delete jobs.' });
    }

    const { id: jobId } = req.params;
    const result = await deleteJob(jobId, req.approvedStartup.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getJobsController = async (req, res) => {
  try {
    let jobs;

    if (req.isAdmin) {
      // Admins can view all jobs with startup details
      jobs = await getAllJobsWithStartups();
    } else if (req.approvedStartup) {
      // Startups can only see their own jobs
      jobs = await getJobsByCompanyId(req.approvedStartup.id);
    } else {
      jobs = [];
    }

    res.status(200).json({ results: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicantsController = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    // Verify job ownership for non-admins
    if (!req.isAdmin && req.approvedStartup) {
      const job = await getJobById(jobId);
      if (job.company_id !== req.approvedStartup.id) {
        return res.status(403).json({ message: 'You can only view applicants for your own jobs.' });
      }
    }

    const applicants = await getApplicantsForJob(jobId);
    res.status(200).json({ results: applicants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatusController = async (req, res) => {
  try {
    // Only approved startups can update application status
    if (req.isAdmin) {
      return res.status(403).json({ message: 'Admins cannot update application status.' });
    }

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
  updateJobController,
  deleteJobController,
  getJobsController,
  getApplicantsController,
  updateApplicationStatusController,
};
