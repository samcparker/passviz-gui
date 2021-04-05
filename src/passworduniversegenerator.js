import axios from "axios";
import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

export default class PasswordUniverseGenerator {
        
    /**
     * Get strength of stars and add them to stars list.
     * 
     * @param  {object} stars - list of stars objects
     * 
     * @return {stars list} - list of stars objects with their strenghts 
     */
    addStrengths(stars) {
        for (let i = 0; i < stars.length; i++) {
            stars[i]["strengths"] = {};
            const zxcvbn = require("zxcvbn");
            const owasp = require("owasp-password-strength-test");


            // zxcvbn gives a score from 1 to 4. So we can represent this as a percentage using score/4.
            stars[i]["strengths"]["zxcvbn"] = zxcvbn(stars[i].value).score / 4;
            
            const owaspResult = owasp.test(stars[i].value);
 
            // get number of passed tests out of total tests (7)
            const owaspScore = owaspResult.passedTests.length / 7;
            stars[i]["strengths"]["owasp"] = owaspScore;
        }
        

        return stars;
    }
    /**
     * Generate a universe from the list of passwords given the dimensionality reduction method and generation method.
     * 
     * It will check if an external server is used, and if so, will use that. Otherwise, it will generate from the client side.
     * 
     * @param  {string list} passwords - list of passwords
     * @param  {string} externalServer - address of external server
     * @param  {string} drMethod - Dimensionality reduction method to use
     * @param  {string} gmMethod - Generation method to use
     * 
     * @return {promise}
     */
    generate(passwords, externalServer, drMethod, gmMethod) {

        return new Promise((resolve, reject) => {
            if (externalServer) {
                // Generate from server
                this.generateFromServer(passwords, externalServer, drMethod, gmMethod)
                .then(stars => {
                    const res = this.addStrengths(stars);
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
            }
            else {
                // Generate from client because externalServer is null
                
                const stars = this.generateFromClient(passwords);
                const res = this.addStrengths(stars);
                resolve(res);
            }
        });


    }
    /**
     * Generate a universe from the client side.
     * 
     * @param  {string list} passwords - list of passwords to generate universe from
     */
    generateFromClient(passwords) {
            return new Promise((resolve, reject) => {
                // Create a worker to generate universe in parallel.
                const worker = new Worker();
                const promiseWorker = new PromiseWorker(worker);
                
                // Get dimensionality reduction.
                const getDR = (passwords) => promiseWorker.postMessage({
                    type: 'getDR', passwords
                  });
    
                 getDR(passwords).then(dr => {
                     const stars = [];
                    
                     // From dimensionality reduction, append each item to a list.
                    for (let i = 0; i < passwords.length; i++) {
                        const star = {
                            value: passwords[i],
                            position: {
                                x: dr[i][0],
                                y: dr[i][1],
                            }
                        };
                        stars.push(
                            star
                        );
                    }
                     resolve(stars);
                 });

            });

    }

    
    
    /**
     * Generate a universe from the external server given the specified parameters.
     * 
     * drMethod must be "TSNE", "UMAP" or "MDS" otherwise an error will be received from the server.
     * gmMethod must be "", "", "" or "" otherwise an error will be receiver from the server.
     * 
     * @param  {string list} passwords - List of passwords
     * @param  {string} externalServer - Address of external server
     * @param  {string} drMethod - Dimensionality reduction method to use
     * @param  {string} gmMethod - Generation method to use
     * 
     * @return {Promise} - Promise with universe results
     */
    generateFromServer(passwords, externalServer, drMethod, gmMethod) {

        return new Promise((resolve, reject) => {
            const formData = new FormData();

            // Add all data to FormData object.
            formData.append("password_list", JSON.stringify(passwords));
            formData.append("dr_method", drMethod);
            formData.append("gm_method", gmMethod);
            
            // Add / to end of URL if there isn't already one there.
            if (externalServer.charAt(externalServer.length) != "/") {
                externalServer += "/";
            }

            // Send Post request to the server with the form parameters from above.
            axios.post(`${externalServer}generate`, formData)
                .then((res) => {
                    const stars = res.data.stars;

                    resolve(stars);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }


}