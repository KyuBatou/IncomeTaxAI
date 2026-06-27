
import json
import requests
import string
import random
import PaytmChecksum


# MID = 'Resell00448805757124'
# MERCHANT_KEY = "KXHUJH&Ywq9pUkkr"
# WEBSITE = "WEBSTAGING"
# INDUSTRY_TYPE_ID = "Retail"
# CHANNEL_ID = "WEB"
# CALLBACK_URL = "http://ai.incometaxlibrary.com/ai/verify-payment/"
# PAYTM_CHANNEL_ID = 'WEB'
# PAYTM_INDUSTRY_TYPE_ID = 'Retail'
# PAYTM_ENVIRONMENT = 'TEST'
# PAYTM_PRODUCTION_URL = 'https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction'


MID = 'lkyXGo09594002719561'
MERCHANT_KEY = "z@SST3ZOsqmGlT1l"
WEBSITE ='DEFAULT'
INDUSTRY_TYPE_ID = "Retail"
CHANNEL_ID = "WEB"
CALLBACK_URL = "http://ai.incometaxlibrary.com/ai/verify-payment/"
PAYTM_CHANNEL_ID = 'WEB'
PAYTM_INDUSTRY_TYPE_ID = 'Retail'
PAYTM_ENVIRONMENT = 'PROD'
PAYTM_PRODUCTION_URL = 'https://securegw.paytm.in/theia/api/v1/initiateTransaction'


# PAYTM_MID='lkyXGo09594002719561'
# PAYTM_MERCHANT_KEY="z@SST3ZOsqmGlT1l"
# PAYTM_WEBSITE='DEFAULT'
# PAYTM_CHANNEL_ID = 'WEB'
# PAYTM_INDUSTRY_TYPE_ID = 'Retail'
# PAYTM_ENVIRONMENT = 'PROD'
# PAYTM_PRODUCTION_URL = 'https://securegw.paytm.in/theia/api/v1/initiateTransaction'

def generate_order_id():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))


def create_order():
    order_id = generate_order_id()
    amount = "1.00"
    customer_id = "CUST001"

    paytmParams = {
        "body": {
            "requestType": "Payment",
            "mid": MID,
            "orderId": str(order_id),
            "websiteName": WEBSITE,
            "txnAmount": {
                "value": amount,
                "currency": "INR",
            },
            "userInfo": {
                "custId": customer_id,
            }
        }
    }
    # ✅ FIXED checksum
    checksum = PaytmChecksum.generateSignature(json.dumps(paytmParams["body"]), MERCHANT_KEY)
    paytmParams["head"] = {
        "signature": checksum
    }

    post_data = json.dumps(paytmParams)

    url = f"{PAYTM_PRODUCTION_URL}?mid={MID}&orderId={order_id}"
    response = requests.post(url, data=post_data, headers={"Content-type": "application/json"})
    print("Status Code:", response.status_code)
    print("Raw Response:", response.text)

    try:
        print("JSON:", response.json())
    except:
        print("Invalid JSON response")

create_order()