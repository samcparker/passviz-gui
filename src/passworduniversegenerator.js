import axios from "axios";




import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

export default class PasswordUniverseGenerator {

    constructor() {
        return;
    }

    // Generate a new star universe. Promise return type.
    generate(passwords, externalServer) {

        // if (externalServer) {
        //     return new Promise((resolve, reject) => {
        //         this.generateFromServer(passwords, externalServer)
        //             .then((res) => {
        //                 resolve(res);
        //             })
        //             .catch((err) => {
        //                 reject(err);
        //             });
        //     });
        // }
        // return new Promise((resolve, reject) => {
        //     const points = this.generateFromClient(passwords);

        //     resolve(points);

        //     // const dr = await spawn(new Worker("./workers/auth"))
        // });
        return new Promise((resolve, reject) => {
            if (externalServer) {
                // Generate from server
                this.generateFromServer(passwords, externalServer)
                .then(res => {
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

                resolve(this.generateFromClient(passwords));
                
   
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
                     console.log("got dr as", dr);
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
            console.log(passwords)
            console.log(passwords.length)
            formData.append("password_list", JSON.stringify(passwords));

            axios.post(`${externalServer}generate`, formData)
                .then((res) => {

                    const stars = res.data.stars;
                    console.log(stars);
                    resolve(stars);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }


}