export default {
  Query: {
    assessment: async (parent, args, { Assessment }) => {
      const assessment = await Assessment.findOne({ _id: args._id })
      return assessment
    },
    allAssessments: async (parent, args, { Assessment }) => {
      const assessments = await Assessment.find()
      return assessments.map((assessment) => {
        assessment._id = assessment._id.toString()
        return assessment
      })
    }
  },
  Mutation: {
    createAssessment: async (
      parent,
      { assessmentInput },
      { Assessment, Visit, Staff, Issue }
    ) => {
      const {
        visitId,
        issuesIds,
        satisfactoryRating,
        assessmentById,
        assessmentOfId
      } = assessmentInput
      const assessment = await new Assessment({
        satisfactoryRating: satisfactoryRating
      }).save()

      try {
        var issues = []
        for (let i = 0; i < issuesIds.length; i++) {
          try {
            const issue = await Issue.findOne({ _id: issuesIds[i] }).exec()
            issues.push(issue)
          } catch (err) {
            console.log('error')
          }
        }
        var errors = []
        var visit = null

        const assessmentBy = await Staff.findOne({ _id: assessmentById }).exec()
        console.log(3, Staff, assessmentBy, assessmentById)
        const assessmentOf = await Staff.findOne({ _id: assessmentOfId }).exec()
        try {
          visit = await Visit.findOne({ _id: visitId }).exec()
        } catch (err) {
          errors.push('Visit not found')
        }

        console.log(5)
        const updatedAssessment = await Assessment.findOneAndUpdate(
          { _id: assessment._id },
          {
            issues: issues,
            visit: visit,
            assessmentBy: assessmentBy._id,
            assessmentOf: assessmentOf._id
          },
          { new: true }
        )
        updatedAssessment._id = updatedAssessment._id.toString()
        return updatedAssessment
      } catch {
        return {
          __typename: 'ObjectNotFound',
          message:
            "We couldn't find the staff with either one of ${assessmentById}, ${assessmentOfId} ."
        }
      }
    },
    updateAssessment: async (parent, args, { Assessment }) => {
      const assessment = await Assessment.findOneAndUpdate(
        { _id: args._id },
        args.assessmentInput,
        { new: true }
      )

      return assessment
    },
    removeAssessment: async (parent, args, { Assessment }) => {
      const assessment = await Assessment.findByIdAndRemove({ _id: args._id })

      return assessment
    }
  }
}
