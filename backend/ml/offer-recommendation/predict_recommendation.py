import json
import sys
from pathlib import Path

import joblib
import pandas as pd


ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL_PATH = ROOT / "subscription_recommendation_model.joblib"

FEATURE_COLUMNS = [
    "lastPlanId",
    "mostRenewedPlanId",
    "totalSubscriptions",
    "renewalCount",
    "cancelCount",
    "expiredWithoutRenewalCount",
    "successfulPaymentsCount",
    "failedPaymentsCount",
    "canceledPaymentsCount",
    "paymentSuccessRate",
    "averageDaysBetweenSubscriptions",
    "loyalCustomer",
    "fastCancellationProfile",
]

CATEGORICAL_FEATURES = [
    "lastPlanId",
    "mostRenewedPlanId",
    "loyalCustomer",
    "fastCancellationProfile",
]


def build_input_row(payload: dict) -> pd.DataFrame:
    row = {column: payload.get(column) for column in FEATURE_COLUMNS}
    dataframe = pd.DataFrame([row], columns=FEATURE_COLUMNS)
    for column in CATEGORICAL_FEATURES:
        dataframe[column] = dataframe[column].astype("string")
    return dataframe


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1]:
        model_path = Path(sys.argv[1])
    else:
        model_path = DEFAULT_MODEL_PATH

    payload = json.load(sys.stdin)
    model = joblib.load(model_path)
    input_row = build_input_row(payload)

    predicted_plan_id = model.predict(input_row)[0]
    probabilities = None
    confidence = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(input_row)[0]
        class_labels = list(model.classes_)
        prediction_index = class_labels.index(predicted_plan_id)
        confidence = round(float(probabilities[prediction_index]) * 100)

    response = {
        "predictedPlanId": predicted_plan_id,
        "confidenceScore": confidence,
    }
    print(json.dumps(response))


if __name__ == "__main__":
    main()
