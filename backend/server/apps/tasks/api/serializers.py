from rest_framework import serializers
import tasks.models as models
import cerberus


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Task
        read_only_fields = ('id', 'state', 'result', 'task_id',)
        fields = ('id', 'state', 'params', 'result', 'task_id')
