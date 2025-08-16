from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Profile


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get("username")
    password1 = request.data.get("password1")   # from frontend
    password2 = request.data.get("password2")   # from frontend
    role = request.data.get("role")

    if not username or not password1 or not password2 or not role:
        return Response({"error": "All fields are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # Pass both passwords into the form
    form = UserCreationForm(data={
        "username": username,
        "password1": password1,
        "password2": password2
    })
    if not form.is_valid():
        return Response({"error": form.errors}, status=400)

    user = form.save()
    Profile.objects.create(user=user, role=role)

    return Response({"message": "User created successfully"}, status=201)


@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    # optional: log user into Django session (not needed if React just uses tokens/localStorage)
    login(request, user)

    return Response({
        "message": "Login successful",
        "username": user.username,
        "role": getattr(user.profile, "role", None)
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    username = request.query_params.get("username")
    if not username:
        return Response({"authenticated": False})

    return Response({"authenticated": User.objects.filter(username=username).exists()})


@api_view(['POST'])
@permission_classes([AllowAny])
def signout(request):
    logout(request)  # only relevant if using Django sessions
    return Response({"message": "Logged out successfully"})
