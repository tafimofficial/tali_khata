from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from .models import KhataUser, Transaction, TransactionHistory
from .serializers import KhataUserSerializer, TransactionSerializer, TransactionHistorySerializer

class KhataUserViewSet(viewsets.ModelViewSet):
    queryset = KhataUser.objects.all().order_by('-updated_at')
    serializer_class = KhataUserSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_amount = instance.amount
        
        response = super().update(request, *args, **kwargs)
        
        instance.refresh_from_db()
        new_amount = instance.amount
        
        if old_amount != new_amount:
            TransactionHistory.objects.create(
                transaction=instance,
                previous_amount=old_amount,
                new_amount=new_amount
            )
            instance.user.save()
            
        return response

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.user.save()

@api_view(['GET'])
def summary(request):
    total_balance = Transaction.objects.aggregate(Sum('amount'))['amount__sum'] or 0
    recent_transactions = Transaction.objects.order_by('-date')[:10]
    serializer = TransactionSerializer(recent_transactions, many=True)
    return Response({
        'total_balance': total_balance,
        'recent_activities': serializer.data
    })
