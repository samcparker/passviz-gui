import fastLevenshtein from "fast-levenshtein";
import TSNE from "tsne-js";

export default class PasswordUniverseGenerator {

    constructor() {
        return;
    }

    generate(passwords: string[]) {
        console.log("generating in class");

        console.log("generating distance matrix");
        const distanceMatrix: number[][] = this.generateDistanceMatrix(passwords);
        console.log("finished generating distance matrix");
        console.log(distanceMatrix);

        console.log("generating dr");
        const dr: number[][] = this.generateDimensionalityReduction(distanceMatrix);
        console.log("finished generating dr");
        console.log(dr);

        
        interface Position {
            x: number;
            y: number;
        }
        
        interface Star {
            value: string;
            position: Position;
        }
        
        const stars : Star[] = [];

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
            perplexity: 60.0,
            earlyExaggeration: 4.0,
            learningRate: 10.0,
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