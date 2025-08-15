from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth.hashers import make_password, check_password

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')

    if not username or not password or not role:
        return Response({"error": "Username, password, and role are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    user = User.objects.create(
        username=username,
        password=make_password(password)
    )
    Profile.objects.create(user=user, role=role)

    return Response({"message": "User created successfully"})


@api_view(['POST'])
@permission_classes([AllowAny])
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)

    if not check_password(password, user.password):
        return Response({"error": "Invalid credentials"}, status=400)

    return Response({
        "message": "Login successful",
        "username": user.username,
        "role": user.profile.role
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    username = request.query_params.get("username")
    if not username:
        return Response({"authenticated": False})

    exists = User.objects.filter(username=username).exists()
    return Response({"authenticated": exists})


@api_view(['POST'])
@permission_classes([AllowAny])
def signout(request):
    # Nothing to do here since no sessions are stored
    return Response({"message": "Logged out successfully"})
