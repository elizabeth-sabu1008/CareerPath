const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    firebaseUid: {
      type: String,
      required: true,
      index: true
    },
    pronouns: {
      type: String,
      default: 'they/them'
    },
    accessibilityNeeds: {
      type: [String],
      default: []
    },
    preferredLanguage: {
      type: String,
      default: 'English'
    },
    quizResults: {
      scores: {
        analytical: { type: Number, default: 0 },
        creative: { type: Number, default: 0 },
        social: { type: Number, default: 0 },
        technical: { type: Number, default: 0 }
      },
      topMatch: {
        type: String,
        default: ''
      }
    },
    savedCareers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CareerTrack'
      }
    ],
    bookedSessions: [
      {
        mentorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Mentor',
          required: true
        },
        date: {
          type: Date,
          required: true
        },
        mentorName: { type: String },
        mentorRole: { type: String },
        company: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);

