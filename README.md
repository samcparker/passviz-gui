# Password Universe

## Installation
Head to the Releases section to find the latest release and install your required version.

It is highly recommend that you use the external server for reductions in the length of time it takes to generate the universe. There are also more options to choose from for generation.

## Usage Guide

### Generating a Universe

To generate a universe, click the Generate button in the bottom left of the screen. A window will pop up with parameters to adjust the generation of the universe.

1. Name: name of the universe;
2. Password database: file containing each password on a new line;
3. Amount of passwords used: number of passwords to use from the database;
4. *Dimensionality reduction method: which dimensionality reduction method to use (see below);
5. *Generation method: which generation method to use (see below).

*\*Only possible if using an external server, otherwise t-SNE and full distance matrix are used.*

Once generation has started, you will have to wait some time before the process is complete. This can take a long amount of tiime for larger data sets.

#### Dimensionality Reduction Method

There are many resources online regarding the three dimensionality reduction methods used. As of yet, user-given parameters are not supported, however these will be introduced in a later version.

The dimensionality reduction method can only be changed when the pu.lib server is used.

1. t-SNE
    - https://opentsne.readthedocs.io/en/latest/
2. UMAP
    - https://umap-learn.readthedocs.io/en/latest/
3. MDS
    - https://scikit-learn.org/stable/modules/generated/sklearn.manifold.MDS.html

#### Universe Generation

There are four methods of universe generation. You can make use of these if using the external pu.lib server. There is no support for this on the client side.

The universe generation method can only be changed when the pu.lib server is used.

1. Full Distance Matrix 
    - Generation a full distance matrix and run dimensionality reduction on this. A very slow method and takes up a lot of memory, but will produce the most accurate results. It is not recommended.
2. IPCA 
    - Generates the distance matrix in batches and uses IPCA to embed this onto a n x 50 dimension, and then embeds this into two dimensions using the dimensionality reduction algorithm. It takes a longer amount of time than generate the full distance matrix, but can generate large universes due to not requiring much memory.
3. Character Dimension
    - Quickest method where each character is changed into its unicode equivalent and dimensionality reduction is run on that. Produces results quick and very tight clusters.
4. Sampled Distance Matrix **[RECOMMENDED]**
    - Default method due to its speed and ability to produce interesting clusters. It takes a sample of passwords and generates the distance matrix from that, then runs the dimensionality reduction algorithm on this. Highly recommended for larger data sets.

### Saving and Loading a Universe

Universes can be saved by clicking the Save symbol in the tabs menu. This will contain the names and positions of the universe.

A universe can be loaded by clicking the Load button in the bottom right. A .PU file should be inserted here, or a CSV file containing the points, x and y position of the stars with a \t delimiter.

### Using the External Server

To use the external server, open the settings menu and enabled `External Server Enabled`. Once this is enabled, you have the option to type the URL of the external server into the text field.

The external server requires that you run the `server.py` file within the pu.lib project. The project and instructions can be found **here**.

Once the server is enabled, any generation requests will be sent to the server.

## Contribution

Read CONTRIBUTING.md