/**
 * Class to assign workers to dimensionality reduction tasks
 */

import registerPromiseWorker from "promise-worker/register";


import fastLevenshtein from "fast-levenshtein";
import TSNE from "tsne-js";

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

function generateDimensionalityReduction(distanceMatrix) {
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

  const [error, iter] = model.run();


  const output = model.getOutputScaled();

  return output;

}

registerPromiseWorker((message) => {
  if(message.type === 'getDR') {
    const passwords = message.passwords;


    const dm = generateDistanceMatrix(passwords);

    const dr = generateDimensionalityReduction(dm);

    return dr;
  }
});