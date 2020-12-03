export default {
  Query: {
    city: async (parent, args, { City }) => {
      const city = await City.findOne({ _id: args._id })
      return city
    },
    allCities: async (parent, args, { City }) => {
      const cities = await City.find()
      return cities.map((city) => {
        city._id = city._id.toString()
        return city
      })
    }
  },
  Mutation: {
    createCity: async (parent, cityInput, { City }) => {
      console.log(cityInput)
      const city = await new City(cityInput).save()
      city._id = city._id.toString()
      return city
    },
    updateCity: async (parent, args, { City }) => {
      const city = await City.findOneAndUpdate(
        { _id: args._id },
        args.cityInput,
        { new: true }
      )

      return city
    },
    removeCity: async (parent, args, { City }) => {
      const city = await City.findByIdAndRemove({ _id: args._id })

      return city
    }
  }
}
