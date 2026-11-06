const mongoose = require('mongoose');

const careerTrackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Career description is required']
    },
    baseSalaryRange: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      }
    },
    demandLevel: {
      type: String,
      enum: ['High', 'Medium', 'Stable'],
      default: 'High'
    },
    isRemoteFriendly: {
      type: Boolean,
      default: true
    },
    accessibilityFeatures: {
      type: [String],
      default: []
    },
    welcomesNonTraditional: {
      type: Boolean,
      default: true
    },
    deiRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5
    },
    idealTraits: {
      analytical: { type: Number, min: 1, max: 5, required: true },
      creative: { type: Number, min: 1, max: 5, required: true },
      social: { type: Number, min: 1, max: 5, required: true },
      technical: { type: Number, min: 1, max: 5, required: true }
    },
    roadmap: [
      {
        phase: { type: String, required: true },
        milestones: { type: [String], default: [] }
      }
    ],
    skills: [
      {
        name: { type: String, required: true },
        importance: {
          type: String,
          enum: ['Critical MUST', 'High MUST/GOOD', 'Medium GOOD/BONUS'],
          required: true
        },
        category: {
          type: String,
          default: 'Core'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CareerTrack', careerTrackSchema);

