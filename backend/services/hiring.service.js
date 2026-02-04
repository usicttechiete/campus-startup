const Job = require('../models/Job');
const Application = require('../models/Application');

const getJobs = async (filters) => {
  try {
    const jobs = await Job.findAll(filters);
    return jobs;
  } catch (error) {
    throw new Error(`Error fetching jobs: ${error.message}`);
  }
};

const getJobById = async (jobId) => {
  try {
    const job = await Job.findById(jobId);
    return job;
  } catch (error) {
    throw new Error(`Error fetching job: ${error.message}`);
  }
};

const createJob = async (companyId, jobDetails) => {
  const { role_title, description, type, external_link } = jobDetails;

  if (!role_title || !description || !type) {
    throw new Error('Role title, description, and type are required');
  }

  try {
    const newJob = await Job.create({
      company_id: companyId,
      role_title,
      description,
      type,
      external_link,
    });
    return newJob;
  } catch (error) {
    throw new Error(`Error creating job: ${error.message}`);
  }
};

const applyForJob = async (jobId, applicantId, applicationDetails) => {
  const { resumeLink } = applicationDetails;
  if (!jobId || !applicantId) {
    throw new Error('Job ID and Applicant ID are required');
  }

  try {
    const newApplication = await Application.create({
      job_id: jobId,
      applicant_id: applicantId,
      // In a real app, you would store the resume link or file path
      // For now, we'll just mark the status as Applied.
      status: 'Applied',
    });
    return newApplication;
  } catch (error) {
    throw new Error(`Error creating application: ${error.message}`);
  }
};

const getApplicantsForJob = async (jobId) => {
  try {
    const applicants = await Application.findByJobId(jobId);
    // Optional: Sort by trust_score
    applicants.sort((a, b) => (b.applicant.trust_score || 0) - (a.applicant.trust_score || 0));
    return applicants;
  } catch (error) {
    throw new Error(`Error fetching applicants: ${error.message}`);
  }
};

const updateApplication = async (applicationId, status) => {
  if (!status) {
    throw new Error('Status is required for updating an application');
  }

  try {
    const updatedApplication = await Application.updateStatus(applicationId, status);
    return updatedApplication;
  } catch (error) {
    throw new Error(`Error updating application: ${error.message}`);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getApplicantsForJob,
  updateApplication,
};
