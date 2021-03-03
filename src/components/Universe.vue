<template>
  <div id="universe" >
      <svg id="svg" ref="svg">

      </svg>
        <div v-if="universe.hover" id="hover-overlay"></div>

          <div style="position: absolute; left: 0; bottom: 0">
          <v-text-field
            label="Search/Regex"
            filled
            dense
            style="background-color: white"
          ></v-text-field>
      </div>

      <div style="position: absolute; right: 0; bottom: 0">
          <div class="d-flex flex-column">

          <v-btn @click="resetView()" small>
              <v-icon small>
                  mdi-home
              </v-icon>
          </v-btn>
          <v-btn @click="zoom(1.2)" small>
              <v-icon small>
                  mdi-plus-thick
              </v-icon>
          </v-btn>
          <v-btn @click="zoom(0.8)" small>
              <v-icon small>
                  mdi-minus-thick
              </v-icon>
          </v-btn>
          </div>
      </div>

      <div style="position: absolute; right: 0; top: 0">
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
  </div>
</template>

<script>

import * as d3 from "d3";
import { text } from 'd3';

export default {

    data: () => {
        return {
            zoom: null,
            spread: 50,
            starSize: 50,
            textSize: 50,
            textOpacity: 50
        }
    },
    props: {
        universe: Object,
    },
    methods: {
        setZoomable(zoomable) {
            if (zoomable) {
                this.svg.call(this.zoom);
            }
            else {
                this.svg.on(".zoom", null);
            }
            console.log('Zoom is ' + (zoomable ? 'enabled' : 'disabled'));
        },

        updatePoints(points) {
            this.g.selectAll(".star")
            .data(points, function(d) { return d.value; })
            .enter()
            .append("circle")
            .classed("star", true)
            .attr("fill", function() {
                return "white";
            })
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
                return pos * (width / 2) * spread + (width / 2);
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

                return getPos(d.position.x) + 10;
            })
            .attr("y", (d) => {
                 return getPos(d.position.y) + 10;
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
            const textSize = 20 * this.textSize / 100;
            this.g.selectAll(".annot")
            .style("font-size", textSize);
        },
        updateTextOpacity() {
            const textOpacity = this.textOpacity / 100;
            this.g.selectAll(".annot")
            .style("opacity", textOpacity);
        },
        zoom(amount) {
            this.zoom.scaleBy(this.g.transition().duration(200), amount);
        },
        resetView() {
            this.svg.transition()
                    .duration(750)
                    .call(this.zoom.transform, d3.zoomIdentity);
        }
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


</style>