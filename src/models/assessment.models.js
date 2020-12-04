import mongoose from 'mongoose'

export const assementSchema = new mongoose.Schema(
  {
    assessmentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    assessmentOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    satisfactionRating: { type: Number },
    issues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
      }
    ],
    visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit' }
  },
  { timestamps: true }
)

export const Assessment = mongoose.model('Assessment', assementSchema)
