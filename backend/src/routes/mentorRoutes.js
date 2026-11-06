const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

/**
 * GET /api/mentors
 * Returns all mentors, with optional ?focus= filter (case-insensitive substring or match)
 */
router.get('/', async (req, res) => {
  try {
    const { focus } = req.query;
    let query = {};

    if (focus && focus.trim() && focus !== 'All') {
      // Find mentors where mentorshipFocus array contains focus (case-insensitive regex)
      query.mentorshipFocus = {
        $regex: new RegExp(focus.trim(), 'i')
      };
    }

    const mentors = await Mentor.find(query).sort({ experienceYears: -1 });
    res.json(mentors);
  } catch (error) {
    console.error('[Mentors] Error fetching mentors:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

/**
 * GET /api/mentors/:id
 * Single mentor
 */
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    console.error('[Mentor Detail] Error fetching mentor:', error);
    res.status(500).json({ error: 'Failed to fetch mentor details' });
  }
});

module.exports = router;

