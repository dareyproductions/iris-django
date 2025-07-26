# classifier/views.py
import json
from django.http import JsonResponse
from django.shortcuts import render
from .trained_model import get_prediction  # we will modify this
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'iris.html')

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Extract values
            sepal_length = float(data.get('sepalLength'))
            sepal_width = float(data.get('sepalWidth'))
            petal_length = float(data.get('petalLength'))
            petal_width = float(data.get('petalWidth'))

            # Predict
            species, probabilities = get_prediction([sepal_length, sepal_width, petal_length, petal_width])

            return JsonResponse({
                "species": species,
                "probabilities": probabilities,
                "confidence": round(probabilities[species], 4)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=405)
