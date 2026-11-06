const axios = require('axios');

/**
 * Enriches career tracks with market demand tag and salary estimation.
 * Calls LinkedIn Analytics API if LINKEDIN_ACCESS_TOKEN is configured.
 * On any failure or absence, falls back to marketTag: 'High demand' and salaryEstimation: '₹8-40L'.
 * Never lets this call fail the request.
 */
async function enrichCareerWithMarketData(career) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;

  // Fallback defaults specified in prompt
  const fallback = {
    marketTag: 'High demand',
    salaryEstimation: '₹8-40L'
  };

  if (!token) {
    return fallback;
  }

  try {
    // Attempt LinkedIn Analytics / Learning / Talent API call
    const response = await axios.get('https://api.linkedin.com/v2/marketInsights', {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      },
      params: {
        q: 'title',
        title: career.title,
        geoUrn: 'urn:li:fs_geo:102713980' // India geo
      },
      timeout: 3000
    });

    if (response.data && response.data.elements && response.data.elements.length > 0) {
      const insight = response.data.elements[0];
      return {
        marketTag: insight.demandTag || fallback.marketTag,
        salaryEstimation: insight.salaryFormatted || fallback.salaryEstimation
      };
    }

    return fallback;
  } catch (error) {
    // Fall back quietly, never let this call fail the request
    return fallback;
  }
}

module.exports = {
  enrichCareerWithMarketData
};

