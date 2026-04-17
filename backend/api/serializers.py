from rest_framework import serializers
from .models import KhataUser, Transaction, TransactionHistory

class TransactionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionHistory
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    history = TransactionHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'

class KhataUserSerializer(serializers.ModelSerializer):
    total_balance = serializers.SerializerMethodField()

    class Meta:
        model = KhataUser
        fields = '__all__'
        
    def get_total_balance(self, obj):
        balance = sum(t.amount for t in obj.transactions.all())
        return balance
