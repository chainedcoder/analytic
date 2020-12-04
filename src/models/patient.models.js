import mongoose from 'mongoose'

export const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }
  },
  {
    timestamps: true
  }
)

export const Patient = mongoose.model('Patient', patientSchema)
