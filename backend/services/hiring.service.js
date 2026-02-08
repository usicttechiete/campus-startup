import Job from '../models/Job.js';
import Application from '../models/Application.js';
import supabase from '../config/db.js';

const getJobs = async (filters) => {
  try {
    const jobs = await Job.findAll(filters);

    // Fetch startup details for each job
    const jobsWithStartup = await Promise.all(
      jobs.map(async (job) => {
        const { data: startup } = await supabase
          .from('startups')
          .select('name')
          .eq('id', job.company_id)
          .single();

        return {
          ...job,
          company_name: startup?.name || 'Unknown Startup',
        };
      })
    );

    return jobsWithStartup;
  } catch (error) {
    throw new Error(`Error fetching jobs: ${error.message}`);
  }
};

const getJobsByCompanyId = async (companyId) => {
  try {
    const jobs = await Job.findByCompanyId(companyId);

    // Fetch startup details for each job
    const jobsWithStartup = await Promise.all(
      jobs.map(async (job) => {
        const { data: startup } = await supabase
          .from('startups')
          .select('name')
          .eq('id', job.company_id)
          .single();

        return {
          ...job,
          company_name: startup?.name || 'Unknown Startup',
        };
      })
    );

    return jobsWithStartup;
  } catch (error) {
    throw new Error(`Error fetching jobs by company: ${error.message}`);
  }
};

const getAllJobsWithStartups = async () => {
  try {
    // Fetch all jobs with startup details
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        startups:company_id (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Format the response
    return jobs.map(job => ({
      ...job,
      company_name: job.startups?.name || 'Unknown Startup',
    }));
  } catch (error) {
    throw new Error(`Error fetching all jobs: ${error.message}`);
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
  const { role_title, description, type, external_link, location, stipend, duration, application_deadline, company_id } = jobDetails;

  console.log('createJob called with:', { companyId, company_id, jobDetails });

  if (!role_title || !description || !type) {
    throw new Error('Role title, description, and type are required');
  }

  if (!company_id) {
    throw new Error('Company ID is required');
  }

  try {
    // First verify the startup exists
    const { data: startupExists, error: startupError } = await supabase
      .from('startups')
      .select('id, name')
      .eq('id', company_id)
      .single();

    if (startupError || !startupExists) {
      console.error('Startup not found:', { company_id, startupError });
      throw new Error(`Startup with ID ${company_id} not found in database`);
    }

    console.log('Startup found:', startupExists);

    const newJob = await Job.create({
      company_id: company_id, // Use company_id from request
      role_title,
      description,
      type,
      external_link,
      location,
      stipend,
      duration,
      application_deadline: application_deadline || null,
    });

    return {
      ...newJob,
      company_name: startupExists.name,
    };
  } catch (error) {
    console.error('Error in createJob:', error);
    throw new Error(`Error creating job: ${error.message}`);
  }
};

const updateJob = async (jobId, jobDetails, startupId) => {
  const { role_title, description, type, external_link, location, stipend, duration, application_deadline } = jobDetails;

  try {
    // Verify ownership if startupId is provided
    if (startupId) {
      const job = await Job.findById(jobId);
      if (job.company_id !== startupId) {
        throw new Error('You can only update your own jobs');
      }
    }

    const updatedJob = await Job.update(jobId, {
      role_title,
      description,
      type,
      external_link,
      location,
      stipend,
      duration,
      application_deadline: application_deadline || null,
    });
    return updatedJob;
  } catch (error) {
    throw new Error(`Error updating job: ${error.message}`);
  }
};

const applyForJob = async (jobId, applicantId, applicationDetails) => {
  const { resumeLink } = applicationDetails;
  if (!jobId || !applicantId) {
    throw new Error('Job ID and Applicant ID are required');
  }

  try {
    // Check if user has already applied
    const existingApplication = await Application.findExisting(jobId, applicantId);
    if (existingApplication) {
      throw new Error('You have already applied to this job');
    }

    const newApplication = await Application.create({
      job_id: jobId,
      applicant_id: applicantId,
      resume_link: resumeLink,
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

const getUserApplications = async (applicantId) => {
  try {
    console.log('hiringService.getUserApplications: fetching for', applicantId);
    const applications = await Application.findByApplicantId(applicantId);
    console.log('hiringService.getUserApplications: found', applications?.length);
    return applications;
  } catch (error) {
    throw new Error(`Error fetching user applications: ${error.message}`);
  }
};

const checkHasApplied = async (jobId, applicantId) => {
  try {
    const existingApplication = await Application.findExisting(jobId, applicantId);
    return { hasApplied: !!existingApplication, application: existingApplication };
  } catch (error) {
    throw new Error(`Error checking application status: ${error.message}`);
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

const deleteJob = async (jobId, startupId) => {
  try {
    // Verify ownership if startupId is provided
    if (startupId) {
      const job = await Job.findById(jobId);
      if (job.company_id !== startupId) {
        throw new Error('You can only delete your own jobs');
      }
    }

    await Job.delete(jobId);
    return { success: true, message: 'Job deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting job: ${error.message}`);
  }
};

export {
  getJobs,
  getJobsByCompanyId,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getApplicantsForJob,
  getUserApplications,
  checkHasApplied,
  updateApplication,
  getAllJobsWithStartups,
};
