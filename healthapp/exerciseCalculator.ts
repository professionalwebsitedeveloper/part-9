interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const total = dailyHours.reduce((sum, h) => sum + h, 0);
  const average = total / periodLength;
  const success = average >= target;

  // rating: 1 (bad), 2 (ok), 3 (good)
  let rating = 1;
  let ratingDescription = 'you should work harder';
  const ratio = average / target;
  if (ratio >= 1) {
    rating = 3;
    ratingDescription = 'excellent, target met!';
  } else if (ratio >= 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const parseExerciseArguments = (args: string[]): { target: number; dailyHours: number[] } => {
  if (args.length < 4) throw new Error('Not enough arguments: provide target and daily hours');

  const values = args.slice(2).map((a) => Number(a));
  if (values.some((v) => isNaN(v))) throw new Error('Provided values were not numbers!');

  const target = values[0];
  const dailyHours = values.slice(1);

  return { target, dailyHours };
};

try {
  const { target, dailyHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
