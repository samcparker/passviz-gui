<template>
    <div id="universe">
        <svg id="svg" ref="svg">

        </svg>
        <div v-if="universe.hover" id="hover-overlay"></div>

        <div style="position: absolute; left: 5px; bottom: -24px">
            <v-text-field label="Search/Regex" color="white" @input="doRegex" v-model="regexInput" solo></v-text-field>
        </div>

        <div style="position: absolute; right: 5px; bottom: 5px">
            <div class="d-flex flex-column">

                <v-btn v-if="!selectionMade" @click="startSelect()" small>
                    <v-icon small>
                        mdi-select
                    </v-icon>
                </v-btn>

                <v-row v-else>
                    <v-col>

                    </v-col>
                    <v-col>
                        <v-btn @click="extractSelect()" small>
                            <v-icon small>
                                mdi-content-copy
                            </v-icon>
                        </v-btn>
                    </v-col>
                    <v-col>
                        <v-btn @click="clearSelect()" small>
                            <v-icon small>
                                mdi-select-off
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>


                <v-btn @click="resetView()" small>
                    <v-icon small>
                        mdi-home
                    </v-icon>
                </v-btn>
                <v-btn @click="zoomBy(1.2)" small>
                    <v-icon small>
                        mdi-plus-thick
                    </v-icon>
                </v-btn>
                <v-btn @click="zoomBy(0.8)" small>
                    <v-icon small>
                        mdi-minus-thick
                    </v-icon>
                </v-btn>
            </div>
        </div>

        <div style="position: absolute; right: 5px; top: 5px; width: 220px">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>Graphical Controls</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-subheader class="pl-0">
                            Spread
                        </v-subheader>
                        <v-slider min="0" max="200" v-model="spread" @input="updatePosition()" dense></v-slider>

                        <v-subheader class="pl-0">
                            Star Size
                        </v-subheader>
                        <v-slider min="0" max="100" v-model="starSize" @input="updateSize()" dense></v-slider>

                        <v-subheader class="pl-0">
                            Text Size
                        </v-subheader>
                        <v-slider min="0" max="100" v-model="textSize" @input="updateTextSize()" dense></v-slider>
                        <!-- <v-subheader class="pl-0">
                            Annotations
                        </v-subheader>
                        <v-slider dense></v-slider> -->
                        <v-subheader class="pl-0">
                            Text Opacity
                        </v-subheader>
                        <v-slider min="0" max="100" v-model="textOpacity" @input="updateTextOpacity()" dense></v-slider>

                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>


        <div style="position: absolute; left: 5px; top: 5px; width: 220px">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        Clustering
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-select :items="clusteringMethods" label="Clustering Method"
                            v-model="selectedClusteringMethod" :disabled="generatingClusters"></v-select>
                        <span v-if="selectedClusteringMethod == 'kMeans'">
                            <!-- <v-subheader>Number of Neighbourhoods</v-subheader>
                            <v-slider v-model="numberOfNeighbourhoods" class="align-center" min="1" max="10"></v-slider> -->
                            <v-row no-gutters>
                                <v-col cols="9">
                                    <v-subheader>Number of Clusters</v-subheader>

                                </v-col>
                                <v-col cols="3">
                                    <p>
                                        {{numberOfNeighbourhoods}}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-slider
        v-model="numberOfNeighbourhoods"
        track-color="grey"
        always-dirty
        min="1"
        max="20"
        :disabled="generatingClusters"
      >
      </v-slider>
                        </span>
                        <span v-else>
                            <v-row no-gutters>
                                <v-col cols="9">
                                    <v-subheader>Neighbourhood Radius</v-subheader>

                                </v-col>
                                <v-col cols="3">
                                    <p>
                                        {{neighbourhoodRadius / 1000}}
                                    </p>
                                </v-col>
                            </v-row>
                            <!-- <v-slider v-model="neighbourhoodRadius" class="align-center" max="100" min="1">
                            </v-slider> -->
                    <v-slider
        v-model="neighbourhoodRadius"
        track-color="grey"
        always-dirty
        min="1"
        max="100"
        :disabled="generatingClusters"
      >
      </v-slider>

                            <v-row no-gutters>
                                <v-col cols="9">
                                    <v-subheader>Minimum number of neighbours to form a cluster</v-subheader>

                                </v-col>
                                <v-col cols="3">
                                    <p>
                                        {{minimumNeighbours}}
                                    </p>
                                </v-col>
                            </v-row>
                                <v-slider
                            v-model="minimumNeighbours"
                            track-color="grey"
                            always-dirty
                            min="1"
                            max="10"
                            :disabled="generatingClusters"
                        ></v-slider>

                        </span>

                        <v-row no-gutters>
                            <v-col cols="6" class="px-0">
                                <v-btn class="px-0" style="max-width: 100%" @click="stopColouring">Hide</v-btn>

                            </v-col>
                            <v-col cols="6" class="px-0">
                                <v-btn class="px-0" style="max-width: 100%" @click="doClusters" :disabled="generatingClusters">Process</v-btn>

                            </v-col>
                        </v-row>
                        <v-alert
                        v-model="clusterErrorEnabled"
                        class="mt-2"
                        border="left"
                        color="red"
                        dismissible
                        type="error"
                        style="font-size: 10px"
                        dense
                        >
                        Clustering error. Is the external server enabled?
                        </v-alert>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel>
                    <v-expansion-panel-header>
                        Password Strength
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-select :items="passwordStrengths" label="Strength Meter"
                            v-model="selectedPasswordStrength"></v-select>
                        <v-row no-gutters>
                            <v-col cols="6" class="px-0">
                                <v-btn class="px-0" style="max-width: 100%" @click="stopColouring">Hide</v-btn>

                            </v-col>
                            <v-col cols="6" class="px-0">
                                <v-btn class="px-0" style="max-width: 100%" @click="doPasswordStrength" :disabled="generatingClusters">Process</v-btn>

                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- <v-expansion-panel>
                    <v-expansion-panel-header>
                        Colours
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row no-gutters>
                            <v-col cols="9">
                                <v-subheader>Default Star Colour</v-subheader>
                            </v-col>
                            <v-col cols="3">
                                <input type="color" id="">
                            </v-col>
                        </v-row>

                    </v-expansion-panel-content>
                </v-expansion-panel> -->
            </v-expansion-panels>
        </div>
    </div>
</template>

<script>
/* eslint-disable */

import tinygradient from "tinygradient";
import * as d3 from "d3";
import SelectionArea from "@simonwep/selection-js";

import gen from "random-seed"; 
import cluster from "../cluster";
import storage from "../storage";

export default {
    components: {

    },
    data: () => {
        return {
            defaultStarColor: "FFFFFF",
            backgroundColor: "000000",
            textColor: "FFFFFF",
            zoom: null,
            spread: 0,
            starSize: 20,
            textSize: 20,
            textOpacity: 50,
            selectionMade: false,
            selected: null,
            regexInput: null,
            regex: null,
            clusterAmount: 3,
            // dbscanNeighborhoodRadius: 7,
            generatingClusters: false, // whether clusters are being generated or not. Used to disable process button
            neighbourhoodRadius: 7,
            minimumNeighbours: 2,
            numberOfNeighbourhoods: 3,
            clustering: false,
            clusteringMethods: ["kMeans", "DBSCAN"],
            selectedClusteringMethod: "kMeans",
            passwordStrengths: ["owasp", "zxcvbn"],
            selectedPasswordStrength: "owasp",
            passwordStrengthing: false,

            // show cluster error if it happens
            clusterErrorEnabled: false,
        }
    },
    // computed: {
    //     computedNeighbourhoodRadius: () => {
    //         return this.neighbourhoodRadius / 1000;
    //     }
    // },
    props: {
        universe: Object,
    },
    methods: {
        /**
         * Enabled Password Strength for stars in universe.
         */
        doPasswordStrength() {
            // Stop colouring individual stars.
            this.stopColouring();
            this.passwordStrengthing = true;
            this.updateColors();

        },
        /**
         * Stop colouring individual stars from clustering or strength.
         */
        stopColouring() {
            this.clustering = false;
            this.passwordStrengthing = false;
            this.updateColors();
            this.updateTextOpacity();
        },
        /**
         * Run function to generate clusters and for each cluster find the star closest to the centre.
         * 
         * 
         * TODO: Offload this to server side if user has external server enabled.
         * TODO: Make this more efficient.
         */
        doClusters() {
            this.stopColouring();
            this.clustering = true;
            this.clusterErrorEnabled = false;
            const externalServerEnabled = storage.getItem("externalServerEnabled");
            let externalServer = null;

            if (externalServerEnabled) {
                externalServer = storage.getItem("externalServer");
            }

            this.generatingClusters = true;
            if (this.selectedClusteringMethod == "DBSCAN") {
                cluster.dbscan(this.universe.stars, (this.neighbourhoodRadius / 1000), this.minimumNeighbours, externalServer)
                .then((response) => {
                    processClustering(response);
                })
                .catch((error) => {
                    console.error(error);
                    this.clusterErrorEnabled = true;
                    this.generatingClusters = false;
                });
            }
            else if (this.selectedClusteringMethod == "kMeans") {
                
                cluster.kmeans(this.universe.stars, this.numberOfNeighbourhoods, externalServer)
                .then((response) => {
                    console.log(response);
                    processClustering(response);
                })
                .catch((error) => {
                    console.error(error);
                    this.clusterErrorEnabled = true;
                    this.generatingClusters = false;
                });
            }

            /**
             * Function to process clustering with the name-cluster pair provided by cluster.js.
             */
            const processClustering = (nameClusterObj) => {
                this.generatingClusters = false;
                for (const name in nameClusterObj) {
                    this.universe.stars[name].cluster = nameClusterObj[name];
                }
                // Update the colours to show the clusters
                this.updateColors();

            }
            // this.stopColouring();
            // this.clustering = true;

            // // make 2d array of all points wwhere first index is x pos and second is y pos for each star
            // const dataset = [];
            // const stars = this.universe.stars;
            // for (let i = 0; i < stars.length; i++) {
            //     dataset.push([stars[i].position.x, stars[i].position.y]);
            // }

            // // Sort out clustering method
            // let clusters = null;
            // if (this.selectedClusteringMethod == "DBSCAN") {
            //     const dbscan = new clustering.DBSCAN();
            //     clusters = dbscan.run(dataset, (this.neighbourhoodRadius / 1000), this.minimumNeighbours);
            // }
            // else if (this.selectedClusteringMethod == "OPTICS") {
            //     const optics = new clustering.OPTICS();
            //     clusters = optics.run(dataset, (this.neighbourhoodRadius / 1000), this.minimumNeighbours);
            // }
            // else {
            //     const kmeans = new clustering.KMEANS();
            //     clusters = kmeans.run(dataset, this.numberOfNeighbourhoods);
            // }


            // // Give each star a blank cluster
            // for (let i = 0; i < stars.length; i++) {
            //     stars[i].cluster = null;
            //     stars[i].center = false;
            // }

            // const means = {};

            // for (let i = 0; i < clusters.length; i++) {
            //     // list of indices
            //     const cluster = clusters[i];
            //     const mean = [0, 0];
            //     for (let j = 0; j < cluster.length; j++) {
            //         stars[cluster[j]].cluster = i;

            //         mean[0] += stars[cluster[j]].position.x;
            //         mean[1] += stars[cluster[j]].position.y;

            //     }

            //     mean[0] /= cluster.length;
            //     mean[1] /= cluster.length;


            //     means[i] = mean;
     
            // }

            // // closestIndex will store the index of the closest point along with its position, new items wil be checked against this
            // const closestIndex = {};
            // // for each cluster and each point in the cluster, find closest to means[i]
            // for (let i = 0; i < clusters.length; i++) {
            //     const cluster = clusters[i];
       
            //     for (let j = 0; j < cluster.length; j++) {
             
            //         // cluster[j] is the index of the star in the stars array
            //         const starIndex = cluster[j];
            //         const x = stars[starIndex].position.x;
            //         const y = stars[starIndex].position.y;

            //         const testX = means[i][0];
            //         const testY = means[i][1];


            //         const d = Math.sqrt(Math.pow((testX - x), 2) + Math.pow((testY - y), 2));

            //         // no values in closestIndex for this cluster, put straight in

            //         if (!closestIndex[i]) {
            //             closestIndex[i] = {
            //                 index: starIndex,
            //                 distance: d
            //             };
            //         }
            //         // values are already in closestIndex for this cluster, calculate if closer
            //         else {
            //             if (d < closestIndex[i].d) {
            //                 // closer to mean than previous one

            //                 closestIndex[i].distance = d;
            //                 closestIndex[i].index = starIndex;
            //             }
            //         }
            //     }
            // }
            
            // for (let i = 0; i < clusters.length; i++) {
            //     const closest = closestIndex[i].index;

            //     stars[closest].center = true;
            // }

            // this.updateColors();
            // this.updateTextOpacity();
        },
        /**
         * Enable regex and hide/show stars based off this.
         */
        doRegex() {
            if (this.regexInput == "") {
                    this.regex = null;
                }
                else {
                    this.regex = new RegExp(this.regexInput);

                }
            // this.updateColors();
            this.updateTextOpacity();
            this.updateOpacity();
        },
        /**
         * Start select feature.
         */
        startSelect() {
            // Disable panning or zooming
            this.setZoomable(false);

            const selection = new SelectionArea({

                // document object - if you want to use it within an embed document (or iframe).
                document: window.document,

                // Class for the selection-area element.
                class: 'selection-area',

                // Query selector or dom-node to set up container for the selection-area element.
                container: 'body',

                // Query selectors for elements which can be selected.
                selectables: [".star"],

                // Query selectors for elements from where a selection can be started from.
                startareas: ['#svg'],

                // Query selectors for elements which will be used as boundaries for the selection.
                boundaries: ['#svg'],

                // px, how many pixels the point should move before starting the selection (combined distance).
                // Or specifiy the threshold for each axis by passing an object like {x: <number>, y: <number>}.
                startThreshold: 10,

                // Enable / disable touch support
                allowTouch: true,

                // On which point an element should be selected.
                // Available modes are cover (cover the entire element), center (touch the center) or
                // the default mode is touch (just touching it).
                intersect: 'center',

                // Specifies what should be done if already selected elements get selected again.
                //   invert: Invert selection for elements which were already selected
                //   keep: Make stored elements (by keepSelectio()) 'fix'
                //   drop: Remove stored elements after they have been touched
                overlap: 'invert',

                // Configuration in case a selectable gets just clicked.
                singleTap: {

                    // Enable single-click selection (Also disables range-selection via shift + ctrl).
                    allow: true,

                    // 'native' (element was mouse-event target) or 'touch' (element visually touched).
                    intersect: 'native'
                },

                // Scroll configuration.
                scrolling: {

                    // On scrollable areas the number on px per frame is devided by this amount.
                    // Default is 10 to provide a enjoyable scroll experience.
                    speedDivider: 10,

                    // Browsers handle mouse-wheel events differently, this number will be used as 
                    // numerator to calculate the mount of px while scrolling manually: manualScrollSpeed / scrollSpeedDivider.
                    manualSpeed: 750
                }
            });


            // Once selection is stopped
            selection.on('stop', evt => {
                this.selected = evt.store.selected;
                // Remove selection object
                selection.destroy();
                this.setZoomable(true);

                // Enable buttons for using selection like extract/stop.
                this.selectionMade = true;
                if (this.selected.length == 0) {
                    this.selectionMade = false;
                    return;
                }
    
                // Set the colour of selected stars to red
                for (let i = 0; i < this.selected.length; i++) {
                    d3.select(this.selected[i]).style("fill", "red");
                }
            });
        }, 
        /**
         * Clear selection.
         */
        clearSelect() {
            this.selectionMade = false;
            this.selection = null;
            
            this.updateColors();
        },
        /**
         * Extract selection to new universe. Basically clones the universe but only on a subset.
         */
        extractSelect() {
            // Get cx and cy positions from each selected star. Quicker than finding star in universe array
            // const universe = JSON.parse(JSON.stringify(this.universe));
            const selected = {};

            for (let i = 0; i < this.selected.length; i++) {
                const name = d3.select(this.selected[i]).attr("value");
                selected[name] = this.universe.stars[name];
            }
            this.extractSelectFromStarsList(selected);
        },
        /**
         * Extract selection from list. Takes in a list of stars and extracts those.
         */
        extractSelectFromStarsList(selectedStars) {
            // Create a copy of current universe object
            const universe = JSON.parse(JSON.stringify(this.universe));

            universe.stars = selectedStars;

            if (this.universe.computing) return;

            this.$emit("clone", universe);
            this.clearSelect();
        },
        /**
         * Enable/Disable zooming.
         */
        setZoomable(zoomable) {
            if (zoomable) {
                this.svg.call(this.zoom);
            }
            else {
                this.svg.on(".zoom", null);
            }
        },
        /**
         * Update the opacity of stars in the universe.
         */
        updateOpacity() {
            this.svg.selectAll(".star").style("opacity", (d) => {
                // Regex takes priority. If tests true to regex, it should be visible, else slightly hidden.
                if (this.regex) {
                    if (this.regex.test(d.value)) {
                        return 1;
                    }
                    return .2;
                }
                // Otherwise show star at full opacity
                return 1;
            });
        },
        /**
         * Update the colours of the star. This could be due to clustering or enabling of star strenghtp5.BandPass()
         * To rremove this, use the stopColouring() function.
         */
        updateColors() {
            this.svg.selectAll(".star").style("fill", (d) => {
                // set password strengths
                if (this.passwordStrengthing) {
                    const gradient = tinygradient("red", "green");
                    if (this.selectedPasswordStrength == "owasp") {
                        return gradient.rgbAt(d.strengths.owasp);
                    }
                    if (this.selectedPasswordStrength == "zxcvbn") {
                        return gradient.rgbAt(d.strengths.zxcvbn);
                    }
                    
                    return gradient.rgbAt(d.strengths.jqueryComplexify);
                }

                if (!this.clustering) {
                    return "white";
                }

                if (!d.cluster) {
                    return "white";
                }

                // Set seed of random generator to d.cluster + 5 so that every star in cluster has same colour.
                const random = gen.create(d.cluster + 5);
                // Generate random colour
                const r = random.intBetween(50, 255);
                const g = random.intBetween(50, 255);
                const b = random.intBetween(50, 255);

                return `rgb(${r}, ${g}, ${b})`;
            });
        },
        /**
         *  Update all points in the universe.
         */
        updatePoints(objectPoints) {
            // turn objectPoints into list of points
            const points = []
            for (const name in objectPoints) {
                const star = objectPoints[name];
                points.push(star);
            }


            this.g.selectAll(".star")
            .data(points, function(d) { return d.value; })
            .enter()
            .append("circle")
            .classed("star", true)
            .attr("value", (d) => { return d.value; });

            // Call when a star is clicked, e is the element and d is the data point
            this.g.selectAll(".star").on("click", (e, d) => {
                if (this.clustering) {
                    const selectedCluster = d.cluster;
                    const selected = {};



                    const stars = this.universe.stars;
                    for (const name in stars) {
                        const star = stars[name];
                        // Add to the list each star with this cluster
                        if (star.cluster == selectedCluster) {
                            selected[name] = star;
                        }

                    }

                    this.extractSelectFromStarsList(selected);
                }
            });

            // Do not show annotations when there are more than 20000 points
            if (points.length < 20000) {
                this.g.selectAll(".annot")
                .data(points, function(d) { return d.value; })
                .enter()
                .append("text")
                .classed("annot", true)
                .attr("fill", function() {
                    return "white";
                })
                .text(function(d) {
                    return d.value;
                });

            }
        },
        /**
         * Update the position of stars in the universe. This will be down to the Spread graphical control being changed.
         */
        updatePosition() {
            const width = this.$refs.svg.clientWidth;
            const height = this.$refs.svg.clientHeight;


            const spread = (this.spread - 100) * 0.01;

            function getPos(pos) {
                return spread * pos * width * 0.3 + width / 2;
            }

            this.g.selectAll(".star")
            .attr("cx", (d) => {
                const x = getPos(d.position.x)
                // if (Math.random() < 0.5) console.log(x);
                return x;
            })
            .attr("cy", (d) => {
                return getPos(d.position.y);
            });


            this.g.selectAll(".annot")
            .attr("x", (d) => {

                return getPos(d.position.x);
            })
            .attr("y", (d) => {
                 return getPos(d.position.y);
            });
        },
        /**
         * Update the size of stars in the universe. This will be down to the star size parameter being changed.
         */
        updateSize() {
            const starSize = 10 * this.starSize / 100;
            this.g.selectAll(".star")
            .attr("r", (d) => {
                return starSize;
            });
        },
        /**
         * Update the size of text in the universe. This will be down to text size parameter being changed.
         */
        updateTextSize() {
            const textSize = 20 * this.textSize * 0.01;

            this.svg.selectAll(".annot")
            .style("font-size", textSize + "px");
        },
        /**
         * Update the text opacity of stars in the universe.
         * 
         * Text will have a different opacity based on three conditions:
         * - All text is visible, base it off the text opacity parameter;
         * - RegEx is enabled, only show text that matches this;
         * - Clustering is enabled, only show the stars at the centre of the clusters.
         */
        updateTextOpacity() {
        
            const textOpacity = this.textOpacity / 100;

            this.g.selectAll(".annot")
            .style("opacity", (d) => {
                if (this.regex) {
                    if (this.regex.test(d.value)) {
                        return textOpacity;
                    }
                    return 0;
                }

                if (this.clustering) {
                    if (d.center) {
                        return 1 * textOpacity;
                    }
                    else {
                        return 0;
                    }
                }
                else {
                    return textOpacity;
                }
            });
        },
        /**
         * Zoom in/out of the univere by `amount`.
         * 
         * Used primarly for zoom buttons in universe container.
         * 
         * @param {number} amount - amount to zoom by 
         */
        zoomBy(amount) {
            this.zoom.scaleBy(this.svg.transition().duration(200), amount);
        },
        /**
         * Reset the view of the universe to the default view.
         * 
         * TODO: Fix it so it goes directly to the centre, as at the moment it is off to a side for some reason.
         */
        resetView() {
            this.svg.transition()
                .duration(750)
                .call(this.zoom.transform, d3.zoomIdentity);
        },
        
    },
    mounted() {
        // Set selected clustering method to first item in list
        // this.selectedClusteringMethod = this.clusteringMethods[0];

        this.svg = d3.select(this.$refs.svg);
        this.g = this.svg.append("g");

        this.svg.on("resize", () => {
            this.updatePosition();
        })

        // Initialise Zoom here
        this.zoom = d3.zoom()
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });

        this.setZoomable(true);

        this.updatePoints(this.universe.stars);
        this.updatePosition();
        this.updateSize();
        this.updateTextSize();
        this.updateTextOpacity();
        this.updateColors();
    }

}
</script>

<style>
#hover-overlay {
    position: absolute; 
    top:0; 
    min-width: 100%;
    min-height: 100%; 
    background-color: white; 
    opacity: .2;
}

#universe {
    height: 100%;
    width: 100%;
    background-color: black;
    color: white;
    position: relative;
}

#svg {
    width: 100%;
    height: 100%;
}

.selection-area {
    background: rgba(46, 115, 252, 0.11);
    border: 2px solid rgba(98, 155, 255, 0.81);
    border-radius: 0.1em;
}
</style>