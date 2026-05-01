import json
import sys
from pathlib import Path

import joblib
import numpy as np
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

NUMERIC_FEATURES = [c for c in FEATURE_COLUMNS if c not in CATEGORICAL_FEATURES]


def _scalar_to_cat_str(v: object) -> str:
    """Avoid pandas.NA in cells — sklearn imputers use X != X and break on pd.NA."""
    if v is None:
        return ""
    try:
        if isinstance(v, float) and np.isnan(v):
            return ""
    except (TypeError, ValueError):
        pass
    try:
        if pd.isna(v):
            return ""
    except TypeError:
        pass
    return str(v)


def build_input_row(payload: dict) -> pd.DataFrame:
    row = {column: payload.get(column) for column in FEATURE_COLUMNS}
    dataframe = pd.DataFrame([row], columns=FEATURE_COLUMNS)
    for column in NUMERIC_FEATURES:
        dataframe[column] = pd.to_numeric(dataframe[column], errors="coerce")
    for column in CATEGORICAL_FEATURES:
        dataframe[column] = dataframe[column].map(_scalar_to_cat_str).astype(object)
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
