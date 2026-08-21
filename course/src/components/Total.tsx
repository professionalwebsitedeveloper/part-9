type CoursePart = {
  name: string
  exerciseCount: number
}

interface TotalProps {
  parts: CoursePart[]
}

const Total = ({ parts }: TotalProps) => {
  const total = parts.reduce((sum, p) => sum + p.exerciseCount, 0)
  return <p>Number of exercises {total}</p>
}

export default Total
