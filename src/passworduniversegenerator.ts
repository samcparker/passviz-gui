export default class PasswordUniverseGenerator {

    constructor() {
        return;
    }

    generate(passwords: object) {
        console.log("generating in class");
    }

    distanceMatrix(passwords: string[]) {
        let dm : number[] = [];

        for (let i = 0; i < passwords.length; i++) {
            for (let j = 0; j < i + 1; j++) {
                // const lev = 5;
                console.log(i, j);
                // dm[i][j] = lev;
                // dm[j][i] = lev;
            }
        }

        console.log(dm);
    }

}