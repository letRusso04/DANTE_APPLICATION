from database.danQuery import database_load
import openai
from environment.env import EnviromentPython

class DanteAligheri:
     # Conexion con el sistema de Chat GPT por medio de token, el cual se envira la gama de datos preparados.
    async def StartQueryAI(userId, MessageSend, idBusiness):
            getToken = EnviromentPython()
            openai.api_key =  getToken.tokenAI # Datos introducidos que tendrá por bases el sistema. Estos mismos son de uso global para todos los negocios
            mensajesBase = [
                    {'role':'system', 'content': 'Estás adaptandote para manejar las estadistica y control de registro de flujos de datos como aplicación llamada Dante Aligheri'},
                    {'role':'system', 'content': 'Tus creadores son Jesus Urdaneta y Yeicker Colmenares, quienes se encargaron de la programación del sistema donde trabajas'},
                    {'role':'system', 'content': 'Naciste como Proyecto Universitario para aprobar la unidad curricular Trayecto II, Ingenería en informática. Presentandote como una inovación del desarrollo de la inteligencia Artificial.'},
                    {'role':'system', 'content': 'Estás dispuesto a ofrecer servicio a asistir a los departamentos administrativos de los negocios.'},
                    {'role':'system', 'content': 'No puedes usar comillas dobles o simples en tus respuesta a los usuriarios.'},
            ]    
            #Requerimos la informacion del negocio en especifico, por medio de la consulta dirigida al ID del negocio.
            (connect, query)= await database_load()
            query.execute(f"SELECT `com_name`, `com_dueno`, `com_tel`, `com_ubi` FROM `dan_company` WHERE pk_company ='{idBusiness}'")
            getTotalInformation = query.fetchall()
            nameBusiness = ''
            for business in getTotalInformation:
                mensajesBase.append({'role':'system', 'content': f"Te llamas Dante Aligheri, eres una inteligencia artificial que trabaja para la {business[0]}, su dueño se llama '{business[1]}', el telefono de la empresa es '{business[2]}'"})
                mensajesBase.append({'role':'system', 'content': f"La ubicación geográfica de la empresa es '{business[3]}'"})
                nameBusiness = business[0]
            #Procesa todos los productos del negocio en especifico, se lo entrega en lista de Array al modelo de entrenamiento.
            query.execute(f"SELECT `pr_name`, `pr_amount`, `pr_currency`, `pr_price`, `pr_date` FROM `dan_product` WHERE fg_company = '{idBusiness}'")
            getTotalProduct = query.fetchall()
            for product in getTotalProduct:
                mensajesBase.append({'role':'system', 'content': f"El producto '{product[0]}', posee la cantidad de '{product[1]}', tiene un precio de '{product[3]}' '{product[2]}', fue agregado el dia '{product[4]}' en la '{nameBusiness}'"})
            #Procesa la lista de clientes del negocio especifico, se lo entrega a la list de Array del modelo de entrenamiento.
            query.execute(f"SELECT  `cli_name`, `cli_address`, `cli__cid`, `cli_phone`, `cli_payment` FROM `dan_client` WHERE fg_company = '{idBusiness}'")
            getTotalClient = query.fetchall()
            for client in getTotalClient:
                mensajesBase.append({'role':'system', 'content': f"El cliente '{client[0]}' se ubica en '{client[1]}', su numero de telefono es '{client[3]}' y método de pago es '{client[4]}', pertenece a '{nameBusiness}'"})
            #Procesa la lista de reportes que posee el sistema del negocio especifico.
            query.execute(f"SELECT `report_client`, `report_date`, invo.`re_nameProduct`, invo.`re_varTotal`, invo.`re_currencyProduct`, invo.`re_amount` FROM `dan_report` as re, `dan_invoice` as invo WHERE re.`report_id` = invo.`re_invoice` && re.`report_company` = '{idBusiness}'")
            getTotalReport = query.fetchall()
            for report in getTotalReport:
                mensajesBase.append({'role':'system', 'content': f'El cliente {report[0]} compró el dia {report[1]}, el producto {report[2]} con la cantidad de {report[5]}, total de {report[3]} {report[4]}, en la {nameBusiness}'})
            # Luego de recorrer toda la información, se le anexa la consulta de usuario en especifico.
            mensajesBase.append({'role': 'user', 'content': MessageSend})
            chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", max_tokens=150, messages=mensajesBase)
            query.execute(f"INSERT INTO `dan_chatbot`(`fg_userid`, `chatbot_isDante`, `chatbot_message`) VALUES ('{userId}', 0, '{MessageSend}')")
            gptResponse = chat_completion["choices"][0]["message"]["content"]
            query.execute(f"INSERT INTO `dan_chatbot`(`fg_userid`, `chatbot_isDante`, `chatbot_message`) VALUES ('{userId}', 1, '{gptResponse}')")
            connect.commit()
            return chat_completion["choices"][0]["message"]["content"]