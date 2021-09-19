from abc import ABC, abstractmethod

class _DimensionalityReductionMethod(ABC):
       
    @classmethod
    @abstractmethod
    def fit_transform(cls, points):
        pass

    @classmethod
    @abstractmethod
    def __str__(cls):
        pass

class UMAP(_DimensionalityReductionMethod):

    def fit_transform(cls, points):
        import umap

        umap_obj = umap.UMAP(
            n_jobs=2,
            n_components=2
        )

        embedded = umap_obj.fit_transform(points)

        return embedded


class tSNE(_DimensionalityReductionMethod):

    def fit_transform(cls, points):
        from openTSNE import TSNE

        tsne = TSNE(
            n_components=2,
            n_jobs=2
        )

        embedded = tsne.fit(points)

        return embedded


class MDS(_DimensionalityReductionMethod):

    def fit_transform(cls, points):
        from sklearn.manifold import MDS

        mds = MDS(
            n_components=2,
            n_jobs=2
        )

        embedded = mds.fit_transform(points)

        return embedded

_str_to_method = {
    "umap": UMAP,
    "tsne": tSNE,
    "mds": MDS 
}

def get_dimensionality_reduction_method_from_string(string):
    if string in _str_to_method:
        return _str_to_method[string]
    return None

def get_dimensionality_reduction_keys():
    return "(" + ", ".join(_str_to_method.keys()) + ")"