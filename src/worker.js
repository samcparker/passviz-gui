/**
 * Set of worker functions to generate a universe on the client side.
 */

import registerPromiseWorker from "promise-worker/register";
import fastLevenshtein from "fast-levenshtein";
import TSNE from "tsne-js";

/**
 * Generate a distance matrix from the list of passwords.
 * @param  {string[]} passwords - list of passwords to generate distance matrix from.
 */
function generateDistanceMatrix(passwords) {
  const dm = [];

  for (let i = 0; i < passwords.length; i++) {
    dm.push([]);
    for (let j = 0; j < passwords.length; j++) {
      const lev = fastLevenshtein.get(passwords[i], passwords[j]);
      dm[i].push(lev);
    }
  }

  return dm;
}
/**
 * Run dimensionality reduction on the distance matrix.
 * 
 * @param  {string[][]} distanceMatrix - 2-D distance matrix
 * 
 * @return {number[][]} - embedded distance matrix in two dimensions
 */
function generateDimensionalityReduction(distanceMatrix) {
  // Create t-SNE model
  const model = new TSNE({
    dim: 2,
    perplexity: 30.0,
    earlyExaggeration: 4.0,
    learningRate: 100.0,
    nIter: 1000,
    metric: 'euclidean'
  });

  model.init({
    data: distanceMatrix,
    type: 'dense'
  });

  // Run model and output
  const [error, iter] = model.run();
  const output = model.getOutputScaled();

  return output;

}
/**
 * Register the promise worker. Required for the promise-worker package to work.
 */
registerPromiseWorker((message) => {
  if(message.type === 'getDR') {
    const passwords = message.passwords;
    const dm = generateDistanceMatrix(passwords);

    const dr = generateDimensionalityReduction(dm);

    return dr;
  }
});