import type { CoursePart } from '../types'

interface ContentProps {
  parts: CoursePart[]
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
}

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          <i>{part.description}</i>
        </p>
      )
    case 'group':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />group projects {part.groupProjectCount}
        </p>
      )
    case 'background':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          <i>{part.description}</i>
          <br />background material: {part.backgroundMaterial}
        </p>
      )
    case 'special':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          <i>{part.description}</i>
          <br />requirements: {part.requirements.join(', ')}
        </p>
      )
    default:
      return assertNever(part as never)
  }
}

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((p, i) => (
        <Part key={i} part={p} />
      ))}
    </div>
  )
}

export default Content
type CoursePart = {
  name: string
  exerciseCount: number
}

interface ContentProps {
  parts: CoursePart[]
}

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      <p>
        {parts[0].name} {parts[0].exerciseCount}
      </p>
      <p>
        {parts[1].name} {parts[1].exerciseCount}
      </p>
      <p>
        {parts[2].name} {parts[2].exerciseCount}
      </p>
    </div>
  )
}

export default Content
