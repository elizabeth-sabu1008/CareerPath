const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mentor name is required'],
      trim: true
    },
    pronouns: {
      type: String,
      default: 'they/them'
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0
    },
    skills: {
      type: [String],
      default: []
    },
    mentorshipFocus: {
      type: [String],
      default: []
    },
    availableSlots: {
      type: [Date],
      default: []
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Mentor', mentorSchema);

