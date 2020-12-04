import { ApolloError } from 'apollo-server'
const getIssues = (issuesIds) => {
  var issues = []
  for (let i = 0; i < issuesIds.length; i++) {
    try {
      if (issuesIds[i]) issues.push(issuesIds[i])
    } catch (err) {
      throw new ApolloError(
        "We couldn't find the issue with id ${issuesIds[i]}.",
        'ObjectNotFound'
      )
    }
  }
  return issues
}

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
      { Assessment, Visit, Staff }
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
        const issues = await getIssues(issuesIds)
        const assessmentBy = await Staff.findOne({ _id: assessmentById }).exec()
        const assessmentOf = await Staff.findOne({ _id: assessmentOfId }).exec()
        const visit = await Visit.findOne({ _id: visitId }).exec()
        const updatedAssessment = await Assessment.findOneAndUpdate(
          { _id: assessment._id },
          {
            issues: issues,
            visit: visit,
            assessmentBy: assessmentBy,
            assessmentOf: assessmentOf
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
