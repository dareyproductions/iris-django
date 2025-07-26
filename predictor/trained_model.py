# classifier/trained_model.py
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier

# Load and prepare data
iris = load_iris()
X = iris.data
y = iris.target
target_names = iris.target_names

# Preprocessing
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_scaled, y)

# Prediction interface
def get_prediction(input_data):
    scaled = scaler.transform([input_data])
    prediction = model.predict(scaled)[0]
    probs = model.predict_proba(scaled)[0]
    probability_dict = {
        target_names[i]: float(probs[i])
        for i in range(len(target_names))
    }
    return target_names[prediction], probability_dict
