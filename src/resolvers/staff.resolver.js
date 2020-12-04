export default {
  Query: {
    staff: async (parent, args, { Staff }) => {
      const staff = await Staff.findOne({ _id: args._id })
      return staff
    },
    allStaffs: async (parent, args, { Staff }) => {
      const staffs = await Staff.find()
      return staffs.map((staff) => {
        staff._id = staff._id.toString()
        return staff
      })
    }
  },
  Mutation: {
    createStaff: async (parent, staffInput, { Staff }) => {
      // console.log('Creating ', staffInput, Staff)
      const staff = await new Staff(staffInput).save()
      staff._id = staff._id.toString()
      return staff
    },
    updateStaff: async (parent, args, { Staff }) => {
      const staff = await Staff.findOneAndUpdate(
        { _id: args._id },
        args.staffInput,
        { new: true }
      )

      return staff
    },
    removeStaff: async (parent, args, { Staff }) => {
      const staff = await Staff.findByIdAndRemove({ _id: args._id })

      return staff
    }
  }
}
