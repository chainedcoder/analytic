import mongoose from 'mongoose'

export const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export const City = mongoose.model('City', citySchema)
