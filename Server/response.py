from flask import jsonify

class Response:
    def __init__(self, message: str = "Default message", authorized: bool = False, data: object = None):
        self.response = {
            "message": message,
            "authorized": authorized,
            "data": data if data is not None else {}
        }

    def addfield(self, name, data):
        self.response[name] = data
        return self

    def message(self, message):
        self.response["message"] = message

    def authorize(self):
        self.response["authorized"] = True
        return self

    def data(self, new_data):
        self.response["data"] = new_data
        return self

    def to_json(self):
        return self.response

    def __call__(self):
        return jsonify(self.to_json())

    def __str__(self):
        return jsonify(self.to_json())