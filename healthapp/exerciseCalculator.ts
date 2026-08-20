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

// Example call with hard-coded values
const result = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
console.log(result);
