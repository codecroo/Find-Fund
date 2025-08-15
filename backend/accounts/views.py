from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Profile

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')  # get role from frontend

    if not username or not password or not role:
        return Response({"error": "Username, password, and role are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    Profile.objects.create(user=user, role=role)

    return Response({"message": "User created successfully"})

@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials"}, status=400)

    login(request, user)  # Creates session
    return Response({
        "message": "Login successful",
        "role": user.profile.role  # return role for frontend use
    })

@api_view(['POST'])
def signout(request):
    logout(request)
    return Response({"message": "Logged out successfully"})

@api_view(['GET'])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({
            "authenticated": True,
            "username": request.user.username,
            "role": request.user.profile.role
        })
    return Response({"authenticated": False})
