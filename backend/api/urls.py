from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KhataUserViewSet, TransactionViewSet, summary

router = DefaultRouter()
router.register(r'users', KhataUserViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('summary/', summary, name='summary'),
    path('', include(router.urls)),
]
