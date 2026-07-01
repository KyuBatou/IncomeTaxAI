
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


class CaseLawSummarizeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            main_content = request.POST.get('main_content', '').strip()
            max_length = int(request.POST.get('max_length', 500))
            selected_model = request.POST.get('model')
            session_id = int(request.POST.get('session_id'))
            text_content = main_content
            files = request.FILES.getlist('files')
            print(files)

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
            url = "http://localhost:5002/api/judgements/premium/search/"
            payload = {
                "query": text_content,
                "max_results": 10,
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
                    message.session.title = main_content[::30] + "..."
                message.session.save()
                message.save()
                # return api_response_json
                return JsonResponse({
                    "success": True,
                    "answer": api_response_json.get("answer", "No answer returned from the API."),
                    'query': api_response_json.get("query", ""),
                    'sources_used': api_response_json.get("sources", {}),
                    'results': api_response_json.get("results", {}),
                    'related_judgements': api_response_json.get("related_judgements", ""),
                    'confidence': api_response_json.get("confidence", ""),
                    'query_time_ms': api_response_json.get("query_time_ms", ""),
                    'verification': api_response_json.get("verification", ""),
                    'web_search_used': api_response_json.get("web_search_used", ""),
                    'pipeline': api_response_json.get("pipeline", ""),
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

class CaseLawClarifyView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:

            main_content = request.POST.get('main_content', '').strip()
            max_length = int(request.POST.get('max_length', 500))
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

            url = "http://localhost:5002/api/judgements/premium/clarify/"
            payload = {
                "query": text_content,
                "max_results": 5,
                "session_id":session_id,
                # "message_id": message.pk,
                "selected_model": selected_model,
                "files": files,
            }
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                api_response_json = response.json()
                return JsonResponse({
                    "success": True,
                    'options': [
                        item.get("query")
                        for item in api_response_json.get("options", [])
                        if isinstance(item, dict) and item.get("query")
                    ],
                    # 'options': api_response_json.get("options", ""),
                    'query': api_response_json.get("query", ""),
                    # 'related_judgements': api_response_json.get("related_judgements", ""),
                    # 'confidence': api_response_json.get("confidence", ""),
                    # 'query_time_ms': api_response_json.get("query_time_ms", ""),
                    # 'verification': api_response_json.get("verification", ""),
                    # 'web_search_used': api_response_json.get("web_search_used", ""),
                    # 'pipeline': api_response_json.get("pipeline", ""),
                })
            else:
                return JsonResponse({
                    "success": False,
                    "error": "API request failed with status code {}".format(response.status_code)
                })

        except Exception as e:
            print(e)
            logger.error(f"Summarization error: {str(e)}")
            return JsonResponse({"success": False, "error": f"Server error: {str(e)}"})

class CaseLawRefineView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:

            main_content = request.POST.get('previous_question', '').strip()
            original_answer = request.POST.get('previous_answer', '')
            refinement_instructions = request.POST.get('main_content', '')
            max_length = int(request.POST.get('max_length', 500))
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

            url = "http://localhost:5002/api/judgements/premium/refine/"
            payload = {
                "original_query": text_content,
                "original_answer": original_answer,
                "refinement_instructions": refinement_instructions,
                "max_results": 5,
                "session_id":session_id,
                # "message_id": message.pk,
                "selected_model": selected_model,
                "files": files,
            }
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                api_response_json = response.json()
                return JsonResponse({
                    "success": True,
                    'query': api_response_json.get("query", ""),
                    "answer": api_response_json.get("refined_answer", "No answer returned from the API."),
                    "original_answer": api_response_json.get("original_answer", ""),
                    'sources_used': api_response_json.get("sources", {}),
                    # "answer": api_response_json.get("answer", "No answer returned from the API."),
                    # 'sources': api_response_json.get("sources", ""),
                    # 'related_judgements': api_response_json.get("related_judgements", ""),
                    # 'confidence': api_response_json.get("confidence", ""),
                    # 'query_time_ms': api_response_json.get("query_time_ms", ""),
                    # 'verification': api_response_json.get("verification", ""),
                    # 'web_search_used': api_response_json.get("web_search_used", ""),
                    # 'pipeline': api_response_json.get("pipeline", ""),
                })
            else:
                return JsonResponse({
                    "success": False,
                    "error": "API request failed with status code {}".format(response.status_code)
                })

        except Exception as e:
            print(e)
            logger.error(f"Summarization error: {str(e)}")
            return JsonResponse({"success": False, "error": f"Server error: {str(e)}"})

class CaseLawSimilarView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:

            main_content = request.POST.get('main_content', '').strip()
            context_answer = request.POST.get('previous_answer', '')
            max_length = int(request.POST.get('max_length', 500))
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

            url = "http://localhost:5002/api/judgements/premium/similar/"
            payload = {
                "query": text_content,
                "context_answer": context_answer,
                "max_results": 5,
                "session_id":session_id,
                # "message_id": message.pk,
                "selected_model": selected_model,
                "files": files,
            }
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                api_response_json = response.json()
                return JsonResponse({
                    "success": True,
                    'query': api_response_json.get("query", ""),
                    'results': api_response_json.get("results", ""),
                    'total_found': api_response_json.get("total_found", ""),
                })
            else:
                return JsonResponse({
                    "success": False,
                    "error": "API request failed with status code {}".format(response.status_code)
                })

        except Exception as e:
            print(e)
            logger.error(f"Summarization error: {str(e)}")
            return JsonResponse({"success": False, "error": f"Server error: {str(e)}"})
