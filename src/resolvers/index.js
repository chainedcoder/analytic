import { merge } from 'lodash'
import assessmentResolver from './assessment.resolver.js'
import issueResolver from './issue.resolver.js'
import patientResolver from './patient.resolver.js'
import staffResolver from './staff.resolver.js'
import cityResolver from './city.resolver.js'

const resolvers = merge(
  cityResolver,
  assessmentResolver,
  issueResolver,
  patientResolver,
  staffResolver
)

export default resolvers
