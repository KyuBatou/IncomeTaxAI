
from django.core.files.storage import FileSystemStorage
from django.views.decorators.http import require_POST
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import JsonResponse
import logging, requests

from core.models import AiChatMessage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_url(message, selected_model):
    api_url = "http://localhost:5000/api/v1/"
    if message.session.category == 1:
        if selected_model == 'ask_gst':
            api_url += "query"
        elif selected_model == 'case_law_reserach':
            api_url += "query"
        elif selected_model == 'summarizer':
            api_url += "query"
        elif selected_model == 'draft_assistant':
            api_url += "query"

    elif message.session.category == 2:
        if selected_model == 'ask_gst':
            api_url += "query"
        elif selected_model == 'case_law_reserach':
            api_url += "case-laws"
        elif selected_model == 'summarizer':
            api_url += "summarize"
        elif selected_model == 'draft_assistant':
            api_url += "process_notice"

    return api_url


class SummarizeView(APIView):
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
            url = get_url(message, selected_model)
            payload = {
                "query": text_content,
                "max_results": 5,
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




class ClarifyView(APIView):
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

            url = "http://localhost:5000/api/v1/clarify"
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
                    'options': api_response_json.get("options", ""),
                    'query': api_response_json.get("query", ""),
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

class RefineView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:

            main_content = request.POST.get('main_content', '').strip()
            original_answer = request.POST.get('previous_question', '')
            refinement_instructions = request.POST.get('previous_answer', '')
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

            url = "http://localhost:5000/api/v1/refine"
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
                    'options': api_response_json.get("options", ""),
                    'query': api_response_json.get("query", ""),
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

class SimilarView(APIView):
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

            url = "http://localhost:5000/api/v1/similar"
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
                    'options': api_response_json.get("options", ""),
                    'query': api_response_json.get("query", ""),
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

# Create your views here.
from rest_framework import viewsets
from .models import AiChatSession
from .serializers import AiChatSessionSerializer
from rest_framework.permissions import IsAuthenticated
import uuid

class AiChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = AiChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # return AiChatSession.objects.all().order_by("-last_activity")
        return AiChatSession.objects.filter(
            user=self.request.user
        ).order_by("-last_activity")

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            session_token=str(uuid.uuid4())
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AiChatMessage, AiChatSession
from .serializers import AiChatMessageSerializer


# ✅ GET messages for a session
class SessionMessagesView(APIView):
    def get(self, request, session_id):
        messages = AiChatMessage.objects.filter(session_id=session_id).order_by('created_at')
        serializer = AiChatMessageSerializer(messages, many=True)
        return Response(serializer.data)


# ✅ CREATE message in session
class CreateMessageView(APIView):
    def post(self, request, session_id):
        try:
            session = AiChatSession.objects.get(id=session_id)
        except AiChatSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data

        message = AiChatMessage.objects.create(
            session=session,
            user_query=data.get("user_query"),
            ai_answer=data.get("ai_answer", ""),
            source_bot=data.get("source_bot", "main"),
            is_detailed=data.get("is_detailed", False),
            planner_output=data.get("planner_output"),
            sources_used=data.get("sources_used"),
            sources_shown=data.get("sources_shown"),
            web_context=data.get("web_context"),
            verification=data.get("verification"),
            was_resynthesized=data.get("was_resynthesized", False),
            confidence=data.get("confidence", 0.0),
            query_time_ms=data.get("query_time_ms", 0),
            web_search_used=data.get("web_search_used", True),
            max_results=data.get("max_results", 5),
        )

        serializer = AiChatMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)