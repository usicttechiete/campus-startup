import express from 'express';
const router = express.Router();

// Auth routes are handled by Supabase on the frontend.
// This file is a placeholder as per the documentation.
// No login or signup logic is needed here.

router.get('/session', (req, res) => {
  res.status(200).json({ message: 'Backend does not manage sessions. Verify JWTs directly.' });
});

export default router;
