
from django.core.files.storage import FileSystemStorage
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from core.models import AiChatMessage
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import AiChatMessage
import logging, requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DraftAssistantSummarizeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            main_content = request.POST.get('main_content', '').strip()
            max_length = int(request.POST.get('max_length', 500))
            user_name = request.POST.get('user_name', "")
            business_name = request.POST.get('business_name', "")
            gstin = request.POST.get('gstin', "")
            address = request.POST.get('address', "")

            selected_model = request.POST.get('model')
            session_id = int(request.POST.get('session_id'))
            text_content = main_content
            files = request.FILES.getlist('files')

            if files:
                file_texts = []

                for file in files:
                    file_name = file.name
                    file_content = file.read()
                    # fs = FileSystemStorage()
                    # filename = fs.save(file_name, file)
                    # file_url = fs.url(filename)
                    # print(f"File uploaded to {file_url}")
                    # print(f"File uploaded to {file_content}")
                    # print("File Name:", file_name)
                    file_texts.append(f"[File: {file_name}]")
                text_content = "\n".join(file_texts)
                if main_content:
                    text_content += f"\n\nUser Message:\n{main_content}"

            if not text_content:
                text_content = "No content provided."

            message = AiChatMessage.objects.create(
                session_id=session_id,
                user_query=main_content,
                ai_answer="",
            )
            url = "http://localhost:5004/process_notice/"
            payload = {
                "notice_text": text_content,
                "user_name": user_name,
                "business_name": business_name,
                "gstin": gstin,
                "address": address,
                "session_id":session_id,
                "message_id": message.pk,
                "selected_model": selected_model,
                "files": files,
            }
            response = requests.post(url, json=payload)

            if response.status_code == 200:
                api_response_json = response.json()

                message.ai_answer = api_response_json.get("answer", "No answer returned from the API.")
                message.sources_used = api_response_json.get("sources", {})
                message.session.message_count += message.session.message_count
                if message.session.title == "New Chat":
                    message.session.title = text_content[::30] + "..."
                message.session.save()
                message.save()
                return JsonResponse({
                    "success": True,
                    "answer": api_response_json.get("generated_reply", "No answer returned from the API."),
                    'notice_info': api_response_json.get("notice_info", {}),
                })
            else:
                api_response_json = {}
                message.ai_answer = api_response_json.get("answer", "No answer returned from the API.")
                message.session.message_count += message.session.message_count
                if message.session.title == "New Chat":
                    message.session.title = main_content[::15] + "..."
                message.session.save()
                message.save()
                return JsonResponse({
                    "success": False,
                    "error": "API request failed with status code {}".format(response.status_code)
                })

        except Exception as e:
            print(e)
            logger.error(f"Summarization error: {str(e)}")
            return JsonResponse({"success": False, "error": f"Server error: {str(e)}"})
