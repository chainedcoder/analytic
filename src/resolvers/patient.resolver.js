export default {
  Query: {
    patient: async (parent, args, { Patient }) => {
      const patient = await Patient.findOne({ _id: args._id })
      return patient
    },
    allPatients: async (parent, args, { Patient }) => {
      const patients = await Patient.find()
      return patients.map((patient) => {
        patient._id = patient._id.toString()
        return patient
      })
    }
  },
  Mutation: {
    createPatient: async (parent, { patientInput }, { Patient, Staff }) => {
      const { name, staff } = patientInput
      const patient = await new Patient({ name: name }).save()

      try {
        const staffObj = await Staff.findOne({ _id: staff }).exec()

        const updatedPatient = await Patient.findOneAndUpdate(
          { _id: patient._id },
          { staff: staffObj },
          { new: true }
        )
        updatedPatient._id = updatedPatient._id.toString()
        staffObj._id = staffObj._id.toString()
        return updatedPatient
      } catch (err) {
        console.log(patient)
        patient._id = patient._id.toString()
        return patient
      }
    },
    updatePatient: async (parent, args, { Patient }) => {
      console.log(args)
      const patient = await Patient.findOneAndUpdate(
        { _id: args._id },
        args.patientInput,
        { new: true }
      )

      return patient
    },
    removePatient: async (parent, args, { Patient }) => {
      console.log(args)
      const patient = await Patient.findByIdAndRemove({ _id: args._id })

      return patient
    }
  }
}
