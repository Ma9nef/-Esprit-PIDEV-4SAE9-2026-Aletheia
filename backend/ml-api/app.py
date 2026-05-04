from flask import Flask, request, jsonify
import joblib
import numpy as np
import traceback

app = Flask(__name__)


model  = joblib.load('xgboost_model.pkl')
scaler = joblib.load('scaler.pkl')
# ✅ Print expected feature count on startup
print(f"✅ Model loaded — expects {scaler.n_features_in_} features")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("📥 Received data:", data)

        features = np.array(data['features']).reshape(1, -1)
        print(f"📐 Got {features.shape[1]} features, model expects {scaler.n_features_in_}")

        if features.shape[1] != scaler.n_features_in_:
            return jsonify({
                'error': f"Wrong number of features: got {features.shape[1]}, expected {scaler.n_features_in_}"
            }), 400

        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0].tolist()

        return jsonify({
            'prediction': int(prediction),
            'label': 'Completed' if prediction == 1 else 'Not Completed',
            'probability': probability,
            'confidence': f"{max(probability) * 100:.1f}%"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)