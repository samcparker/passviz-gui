import axios from "axios";



import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

export default class PasswordUniverseGenerator {
    
    constructor() {
        return;
    }
    
    addStrengths(stars) {
        for (let i = 0; i < stars.length; i++) {
            
            // const passwdqc = require("passwdqc");
            // const jqueryComplexify = require("jquery.complexify");
            stars[i]["strengths"] = {};
            const zxcvbn = require("zxcvbn");
            const owasp = require("owasp-password-strength-test");

            stars[i]["strengths"]["zxcvbn"] = zxcvbn(stars[i].value).score / 4;
            
            const owaspResult = owasp.test(stars[i].value);
 
            // get number of passed tests out of total tests (7)
            const owaspScore = owaspResult.passedTests.length / 7;
            stars[i]["strengths"]["owasp"] = owaspScore;
  
            
            // stars[i]["strengths"]["owasp"] = owasp(stars[i].value).score;
            // star.strengths.passwdqc = passwdqc.check(star.value);
            // star.strengths.jqueryComplexify = jqueryComplexify(star.value);
        }
        

        return stars;
    }

    // Generate a new star universe. Promise return type.
    generate(passwords, externalServer) {

        return new Promise((resolve, reject) => {
            if (externalServer) {
                // Generate from server
                this.generateFromServer(passwords, externalServer)
                .then(stars => {
                    const res = this.addStrengths(stars);
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
            }
            else {
                // Generate from client
                // const stars = this.generateFromClient(passwords);
                // resolve(stars);
                
                const stars = this.generateFromClient(passwords);
                const res = this.addStrengths(stars);
                resolve(res);
                
   
            }
        });


    }

    generateFromClient(passwords) {

            return new Promise((resolve, reject) => {
                const stars = [];
        
                const worker = new Worker();
                const promiseWorker = new PromiseWorker(worker);
                
                const getDR = (passwords) => promiseWorker.postMessage({
                    type: 'getDR', passwords
                  });
    
                 getDR(passwords).then(dr => {
                     const stars = [];

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


            // const worker = new Worker();
            // const promiseWorker = new PromiseWorker(Worker);
    
            // promiseWorker.postMessage(passwords).then(function (dr) {
            //     for (let i = 0; i < passwords.length; i++) {
            //         const star = {
            //             value: passwords[i],
            //             position: {
            //                 x: dr[i][0],
            //                 y: dr[i][1],
            //             }
            //         };
            //         stars.push(
            //             star
            //         );
            //     }
        
            //     resolve(stars);
            // });



    }

    

    generateFromServer(passwords, externalServer) {

        return new Promise((resolve, reject) => {
            const formData = new FormData();

            formData.append("password_list", JSON.stringify(passwords));

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