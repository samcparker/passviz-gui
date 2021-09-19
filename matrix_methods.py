from abc import ABC, abstractmethod

class _MatrixMethod(ABC):

    @classmethod
    @abstractmethod
    def generate(cls):
        pass

class FullDistanceMatrix(_MatrixMethod):

    def generate(cls):
        return []

class IPCAMatrix(_MatrixMethod):

    def generate(cls):
        return []

class CharacterDimensionMatrix(_MatrixMethod):

    def generate(cls):
        return []

class SampledMatrix(_MatrixMethod):

    def generate(cls):
        return []

_str_to_method = {
    "fulldistance": FullDistanceMatrix,
    "ipca": IPCAMatrix,
    "characterdimension": CharacterDimensionMatrix,
    "sampled": SampledMatrix 
}

def get_matrix_method_from_string(string):
    string = string.lower()

    if string in _str_to_method:
        return _str_to_method[string]
    return None

def get_matrix_method_keys():
    return "(" + ", ".join(_str_to_method.keys()) + ")"