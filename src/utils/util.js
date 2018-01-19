
// Complementary error function
// From Numerical Recipes in C 2e p221
// https://github.com/errcw/gaussian/blob/master/lib/gaussian.js
function erfc(x) {
  var z = Math.abs(x);
  var t = 1 / (1 + z / 2);
  var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
          t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
          t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
          t * (-0.82215223 + t * 0.17087277)))))))))
  return x >= 0 ? r : 2 - r;
}

// Cumulative Distribution function
export function cumulativeDistribution(x, mean, standardDeviation) {
	return 0.5 * erfc(-(x - mean) / (standardDeviation * Math.sqrt(2)));
}
