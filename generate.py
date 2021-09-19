from dimensionality_reduction_methods import UMAP, get_dimensionality_reduction_method_from_string, get_dimensionality_reduction_keys
from matrix_methods import SampledMatrix, get_matrix_method_from_string, get_matrix_method_keys

import logging

def _process_dimensionality_reduction_argument(dimensionality_reduction_method=None):
    if dimensionality_reduction_method:
        dimensionality_reduction_method_cls = get_dimensionality_reduction_method_from_string(dimensionality_reduction_method)
        if not dimensionality_reduction_method_cls:
            logging.error("Expected dimensionality reduction method from {} but received {}".format(get_dimensionality_reduction_keys(), dimensionality_reduction_method))
            quit()
    else:
        logging.debug("No dimensionality reduction specified, using UMAP as default")
        dimensionality_reduction_method_cls = UMAP

    return dimensionality_reduction_method_cls


def _process_matrix_argument(matrix_method=None):
    if matrix_method:
        matrix_method_cls = get_matrix_method_from_string(matrix_method)
        if not matrix_method_cls:
            logging.error("Expected matrix method from {} but received {}".format(get_matrix_method_keys(), matrix_method))
            quit()
    else:
        logging.debug("No matrix method specified, using sampled matrix as default")
        matrix_method_cls = SampledMatrix

    return matrix_method_cls


def _process_passwords(passwords=None):
    if not passwords:
        logging.error("No passwords specified or empty list")
        quit()
        
    return passwords

def generate(dimensionality_reduction_method=None, matrix_method=None, passwords=None):

    dimensionality_reduction_method = _process_dimensionality_reduction_argument(dimensionality_reduction_method)
    matrix_method = _process_matrix_argument(matrix_method)
    passwords = _process_passwords(passwords)

    matrix = matrix_method.generate(passwords)
    dimensionality_reduction_method.fit_transform(matrix)

if __name__ == "__main__":
    print("Generating")
    generate(dimensionality_reduction_method="tsne", matrix_method="fulldistance", passwords=["hello", "hi", "tewel"])