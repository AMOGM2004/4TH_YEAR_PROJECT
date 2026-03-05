import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load Kaggle dataset
df = pd.read_csv('../ml-data/kaggle_crop_data.csv')
print(f"Dataset shape: {df.shape}")
print(f"Crops: {df['label'].unique()}")
print(f"Total crops: {len(df['label'].unique())}")

X = df.iloc[:, :-1].values
y = df['label'].values

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy:.2%}")

# Save model
pickle.dump(model, open('crop_model_kaggle.pkl', 'wb'))
print("Kaggle model saved!")