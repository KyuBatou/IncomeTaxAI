
import json
import requests
import string
import random
from Taxplus import PaytmChecksum


MID = 'Resell00448805757124'
MERCHANT_KEY = "KXHUJH&Ywq9pUkkr"
WEBSITE = "WEBSTAGING"
INDUSTRY_TYPE_ID = "Retail"
CHANNEL_ID = "WEB"
CALLBACK_URL = "http://ai.incometaxlibrary.com/ai/verify-payment/"
PAYTM_CHANNEL_ID = 'WEB'
PAYTM_INDUSTRY_TYPE_ID = 'Retail'
PAYTM_ENVIRONMENT = 'TEST'
PAYTM_PRODUCTION_URL = 'https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction'

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
            "websiteName": WEBSITE,
            "orderId": order_id,
            "callbackUrl": CALLBACK_URL,
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
    checksum = PaytmChecksum.generateSignature(paytmParams["body"], MERCHANT_KEY)

    paytmParams["head"] = {
        "signature": checksum
    }

    post_data = json.dumps(paytmParams)

    url = f"{PAYTM_PRODUCTION_URL}?mid={MID}&orderId={order_id}"

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, data=post_data, headers=headers)

    print("Status Code:", response.status_code)
    print("Raw Response:", response.text)

    try:
        print("JSON:", response.json())
    except:
        print("Invalid JSON response")

create_order()