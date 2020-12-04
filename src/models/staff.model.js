import mongoose from 'mongoose'

export const staffSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    name: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export const Staff = mongoose.model('Staff', staffSchema)
