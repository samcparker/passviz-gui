/**
 * Set of cluster functions which run on the external server or client-side.
 * 
 * Makes use of worker-threads when needed to prevent program from stalling. 
 */

import axios from "axios";
import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

/**
 * Run k-means on list of stars and return result as a promise.
 * 
 * @param {*} stars List of stars
 * @param {*} noClusters Number of clusters required
 * @param {*} externalServer Address of external server
 * @returns Promise where result is object where key is name and value is cluster.
 */
const kmeans = function(stars, noClusters, externalServer) {
    // Convert `stars` into list of names and list of `positions`
    const names = [];
    const positions = [];
    for (const name in stars) {
        const star = stars[name];
        names.push(star.value);
        positions.push([star.position.x, star.position.y]);
    }

    if (externalServer) {
        // Use external server
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            // Add all data to FormData object.
            formData.append("names", JSON.stringify(names));
            formData.append("positions", JSON.stringify(positions));
            formData.append("n_clusters", noClusters);
            
            // Add / to end of URL if there isn't already one there.
            if (externalServer.charAt(externalServer.length - 1) != "/") {
                externalServer += "/";
            }

            // Send Post request to the server with the form parameters from above.
            axios.post(`${externalServer}kmeans`, formData)
                .then((res) => {  
                    // Name cluster pair
                    const nameClusters = res.data.name_clusters;  
                    // Turn it into object with key is password name and value is cluster label
                    const nameClusterObj = {};
                    for (let i = 0; i < nameClusters.length; i++) {
                        nameClusterObj[nameClusters[i][0]] = nameClusters[i][1];
                    }
                    resolve(nameClusterObj);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    else {
        // Client side kmeans
        return new Promise((resolve, reject) => {
            // Create PromiseWorker to do k-means as an extra worker, preventing program from stalling.
            // Works particularly well with large data sets.
            const worker = new Worker();
            const promiseWorker = new PromiseWorker(worker);

            const getKmeans = (names, positions, noClusters) => promiseWorker.postMessage(
                {
                type: 'kmeans', 
                names,
                positions,
                noClusters
                }
            );
            // Resolve with response from worker
            getKmeans(names, positions, noClusters).then(res => {
                resolve(res);
            });


        });
    }

}


/**
 * Run DBSCAN on the stars with given parameters.
 * 
 * @param {*} stars List of star objects 
 * @param {float} neighbourhoodRadius DBSCAN parameter: neighbourhood radius
 * @param {int} minimumNeighbours DBSCAN parameter: Minimum of neighbours
 * @param {string} externalServer Address of external server, null if not used.
 * @returns Promise where result is object where key is name and value is cluster.
 */
const dbscan = function(stars, neighbourhoodRadius, minimumNeighbours, externalServer) {
    // Convert `stars` into list of names and list of `positions`
    const names = [];
    const positions = [];
    for (const name in stars) {
        const star = stars[name];
        names.push(star.value);
        positions.push([star.position.x, star.position.y]);
    }
    
    if (externalServer) {
        // Use external server
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            // Add all data to FormData object.
            formData.append("names", JSON.stringify(names));
            formData.append("positions", JSON.stringify(positions));
            formData.append("min_samples", minimumNeighbours);
            formData.append("neighbourhood_radius", neighbourhoodRadius);
            
            // Add / to end of URL if there isn't already one there.
            if (externalServer.charAt(externalServer.length - 1) != "/") {
                externalServer += "/";
            }

            // Send Post request to the server with the form parameters from above.
            axios.post(`${externalServer}dbscan`, formData)
                .then((res) => {  
                    // Name cluster pair
                    const nameClusters = res.data.name_clusters;  
                    // Turn it into object with key is password name and value is cluster label
                    const nameClusterObj = {};
                    for (let i = 0; i < nameClusters.length; i++) {
                        nameClusterObj[nameClusters[i][0]] = nameClusters[i][1];
                    }
                    resolve(nameClusterObj);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    else {
        // Client side dbscan
        return new Promise((resolve, reject) => {
            // Create PromiseWorker to create an extra worker to generate the cluster.
            // This allows for other stuff to be done while this is generating

            const worker = new Worker();
            const promiseWorker = new PromiseWorker(worker);

            const getDBSCAN = (names, positions, minimumNeighbours, neighbourhoodRadius) => promiseWorker.postMessage(
                {
                type: 'dbscan', 
                names,
                positions,
                minimumNeighbours,
                neighbourhoodRadius
                }
            );
            // Resolve with results from worker
            getDBSCAN(names, positions, minimumNeighbours, neighbourhoodRadius).then(res => {
                resolve(res);
            });
        });
    }
}


export default { kmeans, dbscan };