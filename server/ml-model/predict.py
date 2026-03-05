import sys
import json
import pickle
import numpy as np

# Load Kaggle model
with open('crop_model_kaggle.pkl', 'rb') as f:
    model = pickle.load(f)

data = json.loads(sys.argv[1])
input_data = np.array([[data['N'], data['P'], data['K'], 
                       data['temperature'], data['humidity'], 
                       data['ph'], data['rainfall']]])



prediction = model.predict(input_data)[0]
proba = model.predict_proba(input_data)[0]
confidence = max(proba)
crop_index = np.argmax(proba)
# print(model.classes_)


print(json.dumps({
    'crop': prediction,
    'confidence': float(confidence),
    'all_probabilities': proba.tolist()
   
}))
