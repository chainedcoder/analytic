export default {
  Query: {
    issue: async (parent, args, { Issue }) => {
      const issue = await Issue.findOne({ _id: args._id })
      return issue
    },
    allIssues: async (parent, args, { Issue }) => {
      const issues = await Issue.find()
      return issues.map((issue) => {
        issue._id = issue._id.toString()
        return issue
      })
    }
  },
  Mutation: {
    createIssue: async (parent, issueInput, { Issue, Staff }) => {
      const { description } = issueInput
      const issue = await new Issue({
        description: description
      }).save()

      issue._id = issue._id.toString()
      return issue
    },
    updateIssue: async (parent, args, { Issue }) => {
      const issue = await Issue.findOneAndUpdate(
        { _id: args._id },
        args.issueInput,
        { new: true }
      )

      return issue
    },
    removeIssue: async (parent, args, { Issue }) => {
      const issue = await Issue.findByIdAndRemove({ _id: args._id })

      return issue
    }
  }
}
