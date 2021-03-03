import { stackOrderReverse } from "d3";
import fastLevenshtein from "fast-levenshtein";
import TSNE from "tsne-js";

import axios from "axios";

export default class PasswordUniverseGenerator {

    constructor() {
        return;
    }

    // Generate a new star universe. Promise return type.
    generate(passwords: string[], externalServer: string) {
        

        if (externalServer) {
            return new Promise((resolve, reject) => {
                this.generateFromServer(passwords, externalServer)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        }
        return new Promise((resolve, reject) => {
            const points = this.generateFromClient(passwords);

            resolve(points);
        });

    }

    generateFromClient(passwords: string[]) {

        interface Position {
            x: number;
            y: number;
        }
        
        interface Star {
            value: string;
            position: Position;
        }

        const stars : Star[] = [];
        const distanceMatrix: number[][] = this.generateDistanceMatrix(passwords);
        const dr: number[][] = this.generateDimensionalityReduction(distanceMatrix);


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
        return stars;
    }

    generateFromServer(passwords: string[], externalServer: string) {

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

    generateDistanceMatrix(passwords: string[]) {
        const dm: number[][] = [];



        for (let i = 0; i < passwords.length; i++) {
            dm.push([]);
            for (let j = 0; j < passwords.length; j++) {
                const lev = fastLevenshtein.get(passwords[i], passwords[j]);
                dm[i].push(lev);
            }
        }


        return dm;
    }

    generateDimensionalityReduction(distanceMatrix: number[][]) {


        const model = new TSNE({
            dim: 2,
            perplexity: 90.0,
            earlyExaggeration: 4.0,
            learningRate: 5,
            nIter: 1000,
            metric: 'euclidean'
        });

        model.init({
            data: distanceMatrix,
            type: 'dense'
        });

        // let [error, iter] = model.run();

        const output = model.getOutputScaled();






        return output;

    }

}