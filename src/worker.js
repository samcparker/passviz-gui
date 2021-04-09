/**
 * Set of worker functions to generate a universe on the client side.
 */

import registerPromiseWorker from "promise-worker/register";
import fastLevenshtein from "fast-levenshtein";
import TSNE from "tsne-js";
import clustering  from "density-clustering";

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
 * Convert clusters object given by density_clustering package to array
 */
 function clustersToArray(clusters, length) {
  const clustersArray = [];
  // Set every item to have cluster of -1
  for (let i = 0; i < length; i++) {
      clustersArray[i] = -1;
  }

  // Give each star its cluster
  for (const c in clusters) {
      const cluster = clusters[c];
      for (let i = 0; i < cluster.length; i++) {
          clustersArray[cluster[i]] = c;
      }
  }
  return clustersArray;
}

function kmeans(names, positions, noClusters) {
  //Returns the a list of cluster numbers and indices pertaining to that cluster
  const clusters = new clustering.KMEANS().run(positions, noClusters);

  const clusterArray = clustersToArray(clusters, names.length);

  // Pair cluster with name and return
  const nameClusterObj = {};
  for (let i = 0; i < names.length; i++) {
      nameClusterObj[names[i]] = clusterArray[i]; // Set all clusters to be no cluster
  }

  return nameClusterObj;
}

function dbscan(names, positions, neighbourhoodRadius, minimumNeighbours) {
  const clusters = new clustering.DBSCAN().run(positions, neighbourhoodRadius, minimumNeighbours);

  const clusterArray = clustersToArray(clusters, names.length);

  // Pair cluster with name and return
  const nameClusterObj = {};
  for (let i = 0; i < names.length; i++) {
      nameClusterObj[names[i]] = clusterArray[i]; // Set all clusters to be no cluster
  }

  return nameClusterObj;
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
  else if (message.type === "kmeans") {
    // const stars = message.stars;

    const names = message.names;
    const positions = message.positions;
    const noClusters = message.noClusters;

    return kmeans(names, positions, noClusters);

  }
  else if (message.type === "dbscan") {
    const names = message.names;
    const positions = message.positions;
    const neighbourhoodRadius = message.neighbourhoodRadius;
    const minimumNeighbours = message.minimumNeighbours;

    return dbscan(names, positions, neighbourhoodRadius, minimumNeighbours);
  }
});