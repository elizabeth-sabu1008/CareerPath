const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const CareerTrack = require('../models/CareerTrack');
const verifyAuthToken = require('../middleware/auth');

// Protect all /api/users routes with Firebase ID token verification middleware
router.use(verifyAuthToken);

/**
 * GET /api/users/profile
 * Returns the currently authenticated user's profile with populated savedCareers
 */
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate('savedCareers');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found. Please sync first.' });
    }
    res.json(user);
  } catch (error) {
    console.error('[User Profile] Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * POST /api/users/sync
 * Create user on first login (find by email), otherwise return the existing one.
 */
router.post('/sync', async (req, res) => {
  try {
    const { email, uid, name } = req.user;
    const { pronouns, accessibilityNeeds, preferredLanguage } = req.body || {};

    let user = await User.findOne({ email: email.toLowerCase() }).populate('savedCareers');

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        firebaseUid: uid,
        name: name || 'Career Explorer',
        pronouns: pronouns || 'they/them',
        accessibilityNeeds: accessibilityNeeds || [],
        preferredLanguage: preferredLanguage || 'English',
        savedCareers: [],
        bookedSessions: []
      });
      await user.save();
      console.log(`[User Sync] Created new user profile for: ${email}`);
    } else {
      let updated = false;
      if (uid && user.firebaseUid !== uid) {
        user.firebaseUid = uid;
        updated = true;
      }
      if (name && (!user.name || user.name === 'Career Explorer')) {
        user.name = name;
        updated = true;
      }
      if (pronouns && user.pronouns !== pronouns) {
        user.pronouns = pronouns;
        updated = true;
      }
      if (accessibilityNeeds && accessibilityNeeds.length > 0) {
        user.accessibilityNeeds = accessibilityNeeds;
        updated = true;
      }
      if (preferredLanguage && user.preferredLanguage !== preferredLanguage) {
        user.preferredLanguage = preferredLanguage;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    res.json(user);
  } catch (error) {
    console.error('[User Sync] Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user account' });
  }
});

/**
 * PUT /api/users/quiz
 * Saves quizResults { scores: { analytical, creative, social, technical }, topMatch }
 */
router.put('/quiz', async (req, res) => {
  try {
    const { scores, topMatch } = req.body;

    if (!scores) {
      return res.status(400).json({ error: 'Missing scores in quiz payload' });
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email.toLowerCase() },
      {
        $set: {
          'quizResults.scores': scores,
          'quizResults.topMatch': topMatch || ''
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('savedCareers');

    res.json({
      message: 'Quiz results saved successfully',
      quizResults: user.quizResults,
      user
    });
  } catch (error) {
    console.error('[User Quiz] Error saving quiz results:', error);
    res.status(500).json({ error: 'Failed to save quiz results' });
  }
});

/**
 * POST /api/users/saved/:careerId
 * Saves a career track to the user's profile
 */
router.post('/saved/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;

    // Verify career exists
    const career = await CareerTrack.findById(careerId);
    if (!career) {
      return res.status(404).json({ error: 'Career track not found' });
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email.toLowerCase() },
      { $addToSet: { savedCareers: careerId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('savedCareers');

    res.json({
      message: 'Career saved successfully',
      savedCareers: user.savedCareers
    });
  } catch (error) {
    console.error('[User Save Career] Error saving career:', error);
    res.status(500).json({ error: 'Failed to save career' });
  }
});

/**
 * DELETE /api/users/saved/:careerId
 * Unsaves a career track from the user's profile
 */
router.delete('/saved/:careerId', async (req, res) => {
  try {
    const { careerId } = req.params;

    const user = await User.findOneAndUpdate(
      { email: req.user.email.toLowerCase() },
      { $pull: { savedCareers: careerId } },
      { new: true }
    ).populate('savedCareers');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Career removed from saved list',
      savedCareers: user.savedCareers
    });
  } catch (error) {
    console.error('[User Unsave Career] Error unsaving career:', error);
    res.status(500).json({ error: 'Failed to unsave career' });
  }
});

/**
 * POST /api/users/book
 * Books a mentor session (mentorId, date)
 */
router.post('/book', async (req, res) => {
  try {
    const { mentorId, date } = req.body;

    if (!mentorId || !date) {
      return res.status(400).json({ error: 'mentorId and date are required' });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: 'Invalid booking date format' });
    }

    const newBooking = {
      mentorId: mentor._id,
      date: bookingDate,
      mentorName: mentor.name,
      mentorRole: mentor.role,
      company: mentor.company
    };

    const user = await User.findOneAndUpdate(
      { email: req.user.email.toLowerCase() },
      { $push: { bookedSessions: newBooking } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: `Session booked successfully with ${mentor.name}!`,
      booking: newBooking,
      bookedSessions: user.bookedSessions
    });
  } catch (error) {
    console.error('[User Book Mentor] Error booking session:', error);
    res.status(500).json({ error: 'Failed to book mentor session' });
  }
});

module.exports = router;

