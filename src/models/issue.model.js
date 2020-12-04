import mongoose from 'mongoose'

export const issueSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    count: {
      type: Number
    }
  },
  { timestamps: true }
)

export const Issue = mongoose.model('Issue', issueSchema)
