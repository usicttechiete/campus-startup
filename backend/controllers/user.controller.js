const User = require('../models/User');

const getMyProfile = async (req, res) => {
  try {
    let userProfile = await User.findById(req.user.id);

    // If profile doesn't exist, create it (first-time login)
    if (!userProfile) {
      const newUser = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.name || req.user.email.split('@')[0], // Use provided name or default
        college: req.user.user_metadata?.college || null,
        course: req.user.user_metadata?.course || null,
        branch: req.user.user_metadata?.branch || null,
        year: req.user.user_metadata?.year || null,
        role: 'student', // Default role
      };
      userProfile = await User.create(newUser);
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: `Error fetching or creating profile: ${error.message}` });
  }
};

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userProfile = await User.findById(id);

    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: `Error fetching profile: ${error.message}` });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);
    console.log("RAW KEYS 👉", Object.keys(req.body));

    const { name, college, course, branch, year, role, about, bio, skills, admin_about, admin_skills, resume_link } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (college !== undefined) updateData.college = college;
    if (course !== undefined) updateData.course = course;
    if (branch !== undefined) updateData.branch = branch;
    if (year !== undefined) updateData.year = year;
    if (skills !== undefined) updateData.skills = skills;
    if (resume_link !== undefined) updateData.resume_link = resume_link;
    if (about !== undefined) updateData.about = about;
    else if (bio !== undefined) updateData.about = bio;

    if (admin_about !== undefined || admin_skills !== undefined) {
      const current = await User.findById(req.user.id);
      if (!current) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      if (current.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin-only profile fields.' });
      }

      if (admin_about !== undefined) updateData.admin_about = admin_about;
      if (admin_skills !== undefined) updateData.admin_skills = admin_skills;
    }

    console.log("UPDATE DATA 👉", updateData);

    if (role !== undefined) {
      const validRoles = ['student', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: 'Invalid role. Valid roles are: student, admin.'
        });
      }

      const ADMIN_UUID = 'dc6cf991-7fbb-44de-ab35-aa014070914a';
      if (role === 'admin' && req.user.id !== ADMIN_UUID) {
        return res.status(403).json({
          message: 'Access denied. You do not have permission to become an admin.'
        });
      }

      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const updatedProfile = await User.updateProfile(
      req.user.id,
      updateData,
    );

    res.status(200).json(updatedProfile);

  } catch (error) {
    res.status(500).json({ message: `Error updating profile: ${error.message}` });
  }
};


const requestAdminUpgrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const { admin_password } = req.body;

    if (String(admin_password || '') !== 'iamanadmin') {
      return res.status(403).json({
        message: 'Access denied. Incorrect admin password.',
        success: false
      });
    }

    // Get current user profile
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check if user is already an admin
    if (userProfile.role === 'admin') {
      return res.status(200).json({
        message: 'You are already an admin!',
        success: true,
        profile: userProfile
      });
    }

    // Update user role to admin
    const updatedProfile = await User.updateProfile(userId, { role: 'admin' });

    res.status(200).json({
      message: 'Congratulations! You have been upgraded to admin.',
      success: true,
      profile: updatedProfile
    });

  } catch (error) {
    res.status(500).json({
      message: `Error processing admin upgrade: ${error.message}`,
      success: false
    });
  }
};

const requestStudentUpgrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const ADMIN_UUID = '6ba34c09-da2b-4887-8a2e-d659463e274e';

    // Get current user profile
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Check if user is already a student
    if (userProfile.role === 'student') {
      return res.status(200).json({
        message: 'You are already registered as a student!',
        success: true,
        profile: userProfile
      });
    }

    // Prevent unauthorized admin accounts from changing roles
    // Only the authorized admin UUID can switch roles freely
    if (userProfile.role === 'admin' && userId !== ADMIN_UUID) {
      return res.status(403).json({
        message: 'Admin accounts cannot change roles.',
        success: false
      });
    }

    // Update user role to student
    const updatedProfile = await User.updateProfile(userId, { role: 'student' });

    res.status(200).json({
      message: 'Successfully switched to student account.',
      success: true,
      profile: updatedProfile
    });

  } catch (error) {
    res.status(500).json({
      message: `Error processing student upgrade: ${error.message}`,
      success: false
    });
  }
};

module.exports = {
  getMyProfile,
  getProfileById,
  updateProfile,
  requestAdminUpgrade,
  requestStudentUpgrade,
};
