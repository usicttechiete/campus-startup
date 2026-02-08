import supabase from '../config/db.js';

const Application = {
  async findByJobId(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:users(id, name, email, college, course, branch, year, trust_score)
      `)
      .eq('job_id', jobId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async findByApplicantId(applicantId) {
    console.log('Application.findByApplicantId: applicantId', applicantId);
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('applicant_id', applicantId)
      .order('submitted_at', { ascending: false });

    console.log('Application.findByApplicantId raw result:', { data, error });

    if (error) {
      console.error('Application.findByApplicantId error:', error);
      throw new Error(error.message);
    }
    console.log('Application.findByApplicantId: data length', data?.length);
    return data;
  },

  async findExisting(jobId, applicantId) {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', applicantId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(error.message);
    }
    return data;
  },

  async create(applicationData) {
    const { data, error } = await supabase.from('applications').insert(applicationData).select().single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async updateStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

export default Application;
