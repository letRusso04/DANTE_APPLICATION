class ModelInterface: 
    def __init__(self, data):
       if data == [] or len(data) < 1 or data == False:
           self.response = 404
           self.data = data
           return
       if data == "BAD_QUERY_RESPONSE":
           self.response = 500
           self.data = data
           return
       if data == "SUCCESS_QUERY_RESPONSE":
           self.response = 201
           self.data = data
           return
       if data == "DELETE_QUERY_RESPONSE":
           self.response = 200
           self.data = data
       if data == "EMPTY_QUERY_RESPONSE":
           self.response = 204
           self.data = data 
           return
       self.response = 200
       self.data = data
        ## Future.
           
           
