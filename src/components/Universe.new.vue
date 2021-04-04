<template>
    <div id="universe">
        <canvas id="canvas" ref="canvas" style="width: 100%; height: 50%;"></canvas>
        <div v-if="universe.hover" id="hover-overlay"></div>

        <div style="position: absolute; left: 0; bottom: 0">
            <v-text-field label="Search/Regex" filled dense style="background-color: white"></v-text-field>
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
    //     const canvas = this.$refs.canvas;

    //     const width = this.$refs.canvas.clientWidth;
    //     const platform = Stardust.platform("webgl-2d", canvas, width, width);

    //     const circleMark = Stardust.mark.circle(8);
    //     const circles = Stardust.mark.create(circleMark, platform);

    //     circles.data(this.universe.stars);


    // // return pos * (width / 2) * spread + (width / 2);
    //     circles.attr("center", d => [ d.position.x * width * 0.5 + width/2, d.position.y * width * 0.5 + width/2]);
    //     circles.attr("radius", 2);
    //     circles.attr("color", [ 0.3, 0.1, 0.7, 1 ]);

    //     circles.render()

        const canvas = this.$refs.canvas;

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