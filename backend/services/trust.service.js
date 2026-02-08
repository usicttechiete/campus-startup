import Endorsement from '../models/Endorsement.js';
import User from '../models/User.js';

// This is a simplified trust score calculation for demonstration.
// A real implementation would be more complex and likely run as a background job.
const calculateTrustScore = async (userId) => {
  try {
    const endorsements = await Endorsement.findByUserId(userId);
    const projectsJoined = (await User.findById(userId))?.projects_joined || 0;

    let score = 0;
    if (endorsements && endorsements.length > 0) {
      const totalRating = endorsements.reduce((acc, curr) => acc + curr.rating, 0);
      score = totalRating / endorsements.length;
    }

    // Add a small bonus for each project joined
    score += projectsJoined * 0.1;

    // Clamp the score between 0 and 5
    const finalScore = Math.min(Math.max(score, 0), 5);

    // Update the user's trust score in the database
    // Note: This is a direct update. In a production system, this would be handled
    // by a worker to avoid race conditions and performance issues.
    const { error } = await require('../config/db')
      .from('users')
      .update({ trust_score: finalScore.toFixed(1) })
      .eq('id', userId);

    if (error) {
      throw new Error('Failed to update trust score');
    }

    return finalScore.toFixed(1);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error calculating trust score for user ${userId}:`, error);
    return 0;
  }
};

const createEndorsement = async (fromUserId, toUserId, rating) => {
  if (!fromUserId || !toUserId || !rating) {
    throw new Error('From user, to user, and rating are required');
  }

  if (fromUserId === toUserId) {
    throw new Error('Users cannot endorse themselves');
  }

  try {
    const newEndorsement = await Endorsement.create({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      rating,
    });

    // After creating an endorsement, trigger a recalculation of the recipient's trust score.
    await calculateTrustScore(toUserId);

    return newEndorsement;
  } catch (error) {
    throw new Error(`Error creating endorsement: ${error.message}`);
  }
};

export {
  createEndorsement,
  calculateTrustScore, // Exporting for potential manual recalculation
};
