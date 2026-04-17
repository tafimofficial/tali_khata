from django.db import models

class KhataUser(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    address = models.TextField(blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#ffffff')
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    user = models.ForeignKey(KhataUser, related_name='transactions', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.name} - {self.amount}"

class TransactionHistory(models.Model):
    transaction = models.ForeignKey(Transaction, related_name='history', on_delete=models.CASCADE)
    previous_amount = models.DecimalField(max_digits=12, decimal_places=2)
    new_amount = models.DecimalField(max_digits=12, decimal_places=2)
    edited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History: {self.transaction.id}"
