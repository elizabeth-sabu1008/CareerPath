const express = require('express');
const router = express.Router();
const CareerTrack = require('../models/CareerTrack');
const { enrichCareerWithMarketData } = require('../services/linkedin');

/**
 * GET /api/careers/matches
 * Query params: analytical, creative, social, technical (sums of 3 questions: 3-15)
 * Divides each by 3 to get 1-5 scale, computes Manhattan distance to each career's idealTraits,
 * sorts ascending, returns top 3 enriched with marketTag and salaryEstimation.
 */
router.get('/matches', async (req, res) => {
  try {
    const rawAnalytical = parseFloat(req.query.analytical) || 9;
    const rawCreative = parseFloat(req.query.creative) || 9;
    const rawSocial = parseFloat(req.query.social) || 9;
    const rawTechnical = parseFloat(req.query.technical) || 9;

    // Divide by 3 to scale 3-15 into 1-5
    const userTraits = {
      analytical: Math.min(5, Math.max(1, rawAnalytical / 3)),
      creative: Math.min(5, Math.max(1, rawCreative / 3)),
      social: Math.min(5, Math.max(1, rawSocial / 3)),
      technical: Math.min(5, Math.max(1, rawTechnical / 3))
    };

    const careers = await CareerTrack.find({});

    if (!careers || careers.length === 0) {
      return res.status(200).json({
        topMatches: [],
        userTraits
      });
    }

    // Compute Manhattan distance
    const scoredCareers = careers.map((career) => {
      const ideal = career.idealTraits;
      const distance =
        Math.abs(userTraits.analytical - ideal.analytical) +
        Math.abs(userTraits.creative - ideal.creative) +
        Math.abs(userTraits.social - ideal.social) +
        Math.abs(userTraits.technical - ideal.technical);

      // Max possible distance on 1-5 scale across 4 traits is (5-1)*4 = 16
      const matchScore = Math.round(Math.max(15, 100 - (distance / 16) * 100));

      return {
        career: career.toObject(),
        distance,
        matchScore
      };
    });

    // Sort ascending by Manhattan distance
    scoredCareers.sort((a, b) => a.distance - b.distance);

    // Pick top 3
    const top3 = scoredCareers.slice(0, 3);

    // Enrich with LinkedIn analytics
    const enrichedTop3 = await Promise.all(
      top3.map(async (item) => {
        const marketData = await enrichCareerWithMarketData(item.career);
        return {
          ...item.career,
          distance: item.distance,
          matchScore: item.matchScore,
          marketTag: marketData.marketTag,
          salaryEstimation: marketData.salaryEstimation
        };
      })
    );

    res.json({
      matches: enrichedTop3,
      userScores: {
        raw: {
          analytical: rawAnalytical,
          creative: rawCreative,
          social: rawSocial,
          technical: rawTechnical
        },
        normalized: userTraits
      }
    });
  } catch (error) {
    console.error('[Career Matches] Error calculating matches:', error);
    res.status(500).json({ error: 'Failed to calculate career matches' });
  }
});

/**
 * GET /api/careers
 * Returns all careers
 */
router.get('/', async (req, res) => {
  try {
    const careers = await CareerTrack.find({});
    res.json(careers);
  } catch (error) {
    console.error('[Careers] Error fetching careers:', error);
    res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

/**
 * GET /api/careers/:id
 * Returns a single career with its full roadmap and skills
 */
router.get('/:id', async (req, res) => {
  try {
    const career = await CareerTrack.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ error: 'Career track not found' });
    }
    res.json(career);
  } catch (error) {
    console.error('[Career Detail] Error fetching career:', error);
    res.status(500).json({ error: 'Failed to fetch career details' });
  }
});

module.exports = router;

