<template>
  <div id="universe" >
      <svg id="svg" ref="svg">

      </svg>
        <div v-if="universe.hover" id="hover-overlay"></div>

          <div style="position: absolute; left: 5px; bottom: -24px">
          <v-text-field
            label="Search/Regex"
            color="white"
            @input="doRegex"
            v-model="regexInput"
            solo
            
  
          ></v-text-field>
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
   <v-expansion-panels popout>
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
            <v-subheader class="pl-0">
            Annotations
            </v-subheader>
          <v-slider dense></v-slider>
            <v-subheader class="pl-0">
            Text Opacity
            </v-subheader>
          <v-slider min="0" max="100" v-model="textOpacity" @input="updateTextOpacity()" dense></v-slider>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
      </div>


      <div style="position: absolute; left: 5px; top: 5px; width: 220px">
   <v-expansion-panels popout>
      <v-expansion-panel>
        <v-expansion-panel-header>Clusters</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-subheader class="pl-0">
            neighborhood radius {{ dbscanNeighborhoodRadius / 100 }}
            </v-subheader>
          <v-slider min="0" max="100" v-model="dbscanNeighborhoodRadius" dense></v-slider>
            <v-subheader class="pl-0">
            number of points in neighborhood to form a cluster {{ dbscanMinimumNeighbours }}
            </v-subheader>
          <v-slider min="1" max="50" v-model="dbscanMinimumNeighbours" dense></v-slider>

            <v-btn @click="stopClustering">Stop</v-btn>
            <v-btn @click="doClusters">Process</v-btn>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
      </div>
  </div>
</template>

<script>

import * as d3 from "d3";
import SelectionArea from "@simonwep/selection-js";
// const clustering = require("density-clustering");
import clustering  from "density-clustering";
import gen from "random-seed"; 
import { text } from 'd3';

export default {

    data: () => {
        return {
            zoom: null,
            spread: 50,
            starSize: 50,
            textSize: 50,
            textOpacity: 50,
            selectionMade: false,
            selected: null,
            regexInput: null,
            regex: null,
            clusterAmount: 3,
            dbscanNeighborhoodRadius: 7,
            dbscanMinimumNeighbours: 2,
            clustering: false

        }
    },
    props: {
        universe: Object,
    },
    methods: {
        stopClustering() {
            this.clustering = false;
            this.updateColors();
            this.updateTextOpacity();
        },
        doClusters() {
            this.clustering = true;
            console.log("doing clusters with", this.clusterAmount);

            // make 2d array of all points wwhere first index is x pos and second is y pos for each star
            const dataset = [];
            const stars = this.universe.stars;
            for (let i = 0; i < stars.length; i++) {
                dataset.push([stars[i].position.x, stars[i].position.y]);
            }
            // const dataset = [
            //     [1,1],[0,1],[1,0],
            //     [10,10],[10,13],[13,13],
            //     [54,54],[55,55],[89,89],[57,55]
            // ];

                    
            // const optics = new clustering.OPTICS();
            const dbscan = new clustering.DBSCAN();
            // // parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
            
            const clusters = dbscan.run(dataset, (this.dbscanNeighborhoodRadius / 100), this.dbscanMinimumNeighbours);

            // Give each star a new cluster
            for (let i = 0; i < stars.length; i++) {
                stars[i].cluster = null;
                stars[i].center = false;
            }

            const means = {};

            for (let i = 0; i < clusters.length; i++) {
                // list of indices
                const cluster = clusters[i];
                const mean = [0, 0];
                for (let j = 0; j < cluster.length; j++) {
                    stars[cluster[j]].cluster = i;

                    mean[0] += stars[cluster[j]].position.x;
                    mean[1] += stars[cluster[j]].position.y;
                    // console.log(stars[cluster[j]].position);

                }

                mean[0] /= cluster.length;
                mean[1] /= cluster.length;


                means[i] = mean;
     
            }

            // closestIndex will store the index of the closest point along with its position, new items wil be checked against this
            const closestIndex = {};
            // for each cluster and each point in the cluster, find closest to means[i]
            for (let i = 0; i < clusters.length; i++) {
                const cluster = clusters[i];
       
                for (let j = 0; j < cluster.length; j++) {
             
                    // cluster[j] is the index of the star in the stars array
                    const starIndex = cluster[j];
                    const x = stars[starIndex].position.x;
                    const y = stars[starIndex].position.y;

                    const testX = means[i][0];
                    const testY = means[i][1];


                    const d = Math.sqrt(Math.pow((testX - x), 2) + Math.pow((testY - y), 2));

                    // no values in closestIndex for this cluster, put straight in

                    if (!closestIndex[i]) {
                        closestIndex[i] = {
                            index: starIndex,
                            distance: d
                        };
                    }
                    // values are already in closestIndex for this cluster, calculate if closer
                    else {
                        if (d < closestIndex[i].d) {
                            // closer to mean than previous one

                            closestIndex[i].distance = d;
                            closestIndex[i].index = starIndex;
                        }
                    }
                }
            }
            
            for (let i = 0; i < clusters.length; i++) {
                const closest = closestIndex[i].index;

                stars[closest].center = true;
            }

            this.updateColors();
            this.updateTextOpacity();
        },
        doRegex() {
            if (this.regexInput == "") {
                    this.regex = null;
                }
                else {
                    this.regex = new RegExp(this.regexInput);

                }
            this.updateColors();
        },
        startSelect() {
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



            selection.on('start', evt => {
                console.log('start', evt);
            }).on('move', evt => {
                console.log('move', evt);
            }).on('stop', evt => {
                this.selected = evt.store.selected;

                selection.destroy();
                this.setZoomable(true);

                this.selectionMade = true;
                if (this.selected.length == 0) {
                    this.selectionMade = false;
                    return;
                }
    

                for (let i = 0; i < this.selected.length; i++) {
                    d3.select(this.selected[i]).style("fill", "red");
                }
            });
        }, 
        clearSelect() {
            this.selectionMade = false;
            this.selection = null;
            
            this.updateColors();
        },
        extractSelect() {
            // Extract selection into its own universe - basically imitate cloning but replace the stars attribute

            const universe = JSON.parse(JSON.stringify(this.universe));

            const selection = [];

            // Inefficient at the moment. The index of stars should be their name and this should be indexed instead
            // for (let i = 0; i < this.selected.length; i++) {
            //     for (let j = 0; j < this.universe.stars.length; i++) {
 
            //         if (this.universe.stars[j].value == d3.select(this.selected[i]).attr("value")) {
            //             selection.push(this.universe.stars[j]);
            //         } 
            //     }
            // }

            for (let i = 0; i < this.selected.length; i++) {
                for (let j = 0; j < this.universe.stars.length; j++) {
                    if (d3.select(this.selected[i]).attr("value") == this.universe.stars[j].value) {
                        selection.push(this.universe.stars[j]);
                    }
                }
            }

            universe.stars = selection;

            if (this.universe.computing) return;

            this.$emit("clone", universe);
            this.clearSelect();

        },
        setZoomable(zoomable) {
            if (zoomable) {
                this.svg.call(this.zoom);
            }
            else {
                this.svg.on(".zoom", null);
            }
            console.log('Zoom is ' + (zoomable ? 'enabled' : 'disabled'));
        },
        updateColors() {
            // const dataset = [];
            // for (let i = 0; i < this.universe.stars.length; i++) {
            //     dataset.push([this.universe.stars[i].position.x, this.universe.stars[i].position.y]);
            // }

            // const clusters = clustering.dbscan.run(dataset, .1, 2);

            // for (let i = 0; i < this.universe.stars.length; i++) {
            //     this.universe.stars[i].cluster = clusters[i];
            // }

            // this.g.selectAll(".star")
            // .attr("fill", function(d) {
            //     // const r = d.cluster * 10;
                
            //     // const g = d.cluster * 20;
            //     // const b = d.cluster * 30;
            //     // return `rgb(${r}, ${g}, ${b})`;
            //     return "white";
            // });
            this.svg.selectAll(".star").style("fill", (d) => {
                
                if (!this.clustering) {
                    return "white";
                }

                if (!d.cluster) {
                    return "white";
                }
   
                const random = gen.create(d.cluster);
                const r = random.intBetween(50, 255);
                const g = random.intBetween(50, 255);
                const b = random.intBetween(50, 255);

                return `rgb(${r}, ${g}, ${b})`;
                // if (this.regex && this.regex.test(d.value)) {
                //     return "red";
                // }
                // return "white";
            });
        },
        updatePoints(points) {
            this.g.selectAll(".star")
            .data(points, function(d) { return d.value; })
            .enter()
            .append("circle")
            .classed("star", true)
            .attr("value", (d) => { return d.value; });

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
        },
        updatePosition() {
            const width = this.$refs.svg.clientWidth;
            const height = this.$refs.svg.clientHeight;

            const spread = (this.spread - 100) * 0.01;

            function getPos(pos) {
                return spread * pos * width * 0.3 + width / 2;
            }

            this.g.selectAll(".star")
            .attr("cx", (d) => {
                return getPos(d.position.x);
            })
            .attr("cy", (d) => {
                return getPos(d.position.y);
            });

            console.log("doing anots now!!");

            this.g.selectAll(".annot")
            .attr("x", (d) => {

                return getPos(d.position.x);
            })
            .attr("y", (d) => {
                 return getPos(d.position.y);
            });
        },
        updateSize() {
            const starSize = 10 * this.starSize / 100;
            this.g.selectAll(".star")
            .attr("r", (d) => {
                return starSize;
            });
        },
        updateTextSize() {
            const textSize = 20 * this.textSize * 0.01;

            this.svg.selectAll(".annot")
            .style("font-size", textSize + "px");
        },
        updateTextOpacity() {
            
            const textOpacity = this.textOpacity / 100;

            this.g.selectAll(".annot")
            .style("opacity", (d) => {
                console.log("is clustering");
                console.log(this.clustering);

                if (this.clustering) {
                    if (d.center) {
                        console.log(d.center);
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
        zoomBy(amount) {
            this.zoom.scaleBy(this.svg.transition().duration(200), amount);
        },
        resetView() {
            this.svg.transition()
                    .duration(750)
                    .call(this.zoom.transform, d3.zoomIdentity);
        },
        
    },
    mounted() {
         // Do d3.js stuff here
        this.svg = d3.select(this.$refs.svg);
        this.g = this.svg.append("g");

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