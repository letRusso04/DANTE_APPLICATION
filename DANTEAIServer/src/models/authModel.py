from database.danQuery import database_load
import time
from services.danEmailServices import DanEmailServices
from interface.modelInterface import ModelInterface
class AuthModels:
    async def modelAuth(email,password):
        try:
            (connect, query)= await database_load()
            query.execute(f"SELECT `us_email`, `us_userid`, `us_verified`, `us_name`, `us_lastname`, `us_subname`, `us_age`, `us_mobile` FROM `dan_user` WHERE us_email = '{email}' && us_password = '{password}'")
            resultData = query.fetchall()
            connect.commit()
        except Exception:
            DTOData = ModelInterface("BAD_QUERY_RESPONSE")
            return DTOData
        DTOData = ModelInterface(resultData)
        return DTOData
