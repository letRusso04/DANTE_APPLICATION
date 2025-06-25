
from DanteAI2024Server.src.models.authModel import AuthModels
"""
Controllers
"""
class AuthControllers:
    async def controllerAuth(email, password):
      # try:
            return await AuthModels.modelAuth(email,password);
       #except:
        #   return 

        