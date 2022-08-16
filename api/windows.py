from enum import Enum


class WindowType(Enum):
    PORTFOLIO = "p"
    MY_WORKS = "w"
    CONTACT = "c"
    REDA = "r"
    TRASH = "t"
    CUSTOM = "u"


class Window:
    def __init__(self, window_data: str):
        window_data = self.__class__.split_window_data(window_data)
        if len(window_data) == 1:
            if window_data[0].strip() != "auto":
                raise ValueError("Invalid single parameter")
            self.bounds = False
        else:
            self.bounds = " ".join(str(float(dimension.strip()))
                                   for dimension in window_data)

    def __repr__(self):
        return f"({self.bounds})"

    @staticmethod
    def split_window_data(window_data: str):
        # Splits a window data string into usuable parts as well as check if there is a valid amount
        dimensions = window_data.split(",")
        if len(dimensions) != 4 and len(dimensions) != 1:
            raise ValueError("Invalid number of dimensions")
        return dimensions


used_names = set()


class CustomWindow:
    def __init__(self, window_data: str):
        window_data = self.__class__.split_window_data(window_data)
        self.bounds = " ".join(str(float(dimension.strip()))
                               for dimension in window_data[0:4])
        self.name = window_data[4].strip()
        if self.name in used_names:
            raise ValueError("Name already used once")
        used_names.add(self.name)
        self.content = window_data[5]

    def __repr__(self):
        return f"{self.name}({self.x} {self.y} {self.w} {self.h}, {self.content})"

    @staticmethod
    def split_window_data(window_data: str):
        data = window_data.split(",")
        if len(data) != 6:
            raise ValueError("Not enough data has been provided")
        return data
