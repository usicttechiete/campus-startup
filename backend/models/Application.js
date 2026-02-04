const supabase = require('../config/db');

const Application = {
  async findByJobId(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:users(id, name, email, academic_year, batch, level, trust_score)
      `)
      .eq('job_id', jobId);

    if (error) {
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

module.exports = Application;
