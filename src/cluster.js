import axios from "axios";
import clustering  from "density-clustering";

/**
 * Convert clusters object given by density_clustering package to array
 */
 const clustersToArray = function(clusters, length) {
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

/**
 * 
 * @param {*} stars List of stars
 * @param {*} noClusters Number of clusters required
 * @param {*} externalServer Address of external server
 * @returns 
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
                    console.log(nameClusterObj);
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
            // Returns the a list of cluster numbers and indices pertaining to that cluster
            const clusters = new clustering.KMEANS().run(positions, noClusters);

            const clusterArray = clustersToArray(clusters, names.length);

            // Pair cluster with name and return
            const nameClusterObj = {};
            for (let i = 0; i < names.length; i++) {
                nameClusterObj[names[i]] = clusterArray[i]; // Set all clusters to be no cluster
            }

            resolve(nameClusterObj);
        });
    }

}



const dbscan = function(stars, neighbourhoodRadius, minimumNeighbours, externalServer) {
    // Convert `stars` into list of names and list of `positions`
    const names = [];
    const positions = [];
    for (const name in stars) {
        const star = stars[name];
        names.push(star.value);
        positions.push([star.position.x, star.position.y]);
    }
    console.log(names);
    console.log(positions);
    
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
                    console.log(nameClusterObj);
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
            // Returns the a list of cluster numbers and indices pertaining to that cluster
            const clusters = new clustering.DBSCAN().run(positions, neighbourhoodRadius, minimumNeighbours);

            const clusterArray = clustersToArray(clusters, names.length);

            // Pair cluster with name and return
            const nameClusterObj = {};
            for (let i = 0; i < names.length; i++) {
                nameClusterObj[names[i]] = clusterArray[i]; // Set all clusters to be no cluster
            }

            resolve(nameClusterObj);
        });
    }
}


export default { kmeans, dbscan };