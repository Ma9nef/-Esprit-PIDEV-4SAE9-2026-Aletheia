from pathlib import Path
import os
import joblib
import pandas as pd
import requests
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "subscription_recommendation_model.joblib"
DATASET_PATH = ROOT / "recommendation_dataset.csv"
DEFAULT_DATASET_URL = "http://localhost:8086/api/subscription-recommendations/dataset.csv"


def load_dataset() -> pd.DataFrame:
    force_refresh = os.environ.get("RECOMMENDER_REFRESH_DATASET", "false").lower() == "true"

    if DATASET_PATH.exists() and not force_refresh:
        return pd.read_csv(DATASET_PATH)

    response = requests.get(DEFAULT_DATASET_URL, timeout=30)
    response.raise_for_status()
    DATASET_PATH.write_text(response.text, encoding="utf-8")
    return pd.read_csv(DATASET_PATH)


def main() -> None:
    df = load_dataset()
    if df.empty:
        raise RuntimeError("Dataset is empty. Generate subscriptions and payments first.")

    if "labelPlanId" not in df.columns:
        raise RuntimeError("Missing labelPlanId column in dataset.")

    feature_columns = [
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

    X = df[feature_columns]
    y = df["labelPlanId"]

    categorical_features = ["lastPlanId", "mostRenewedPlanId", "loyalCustomer", "fastCancellationProfile"]
    numeric_features = [column for column in feature_columns if column not in categorical_features]

    for column in categorical_features:
        X[column] = X[column].astype("string")

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="most_frequent")),
                        ("encoder", OneHotEncoder(handle_unknown="ignore")),
                    ]
                ),
                categorical_features,
            ),
            (
                "numeric",
                Pipeline(
                    steps=[
                        ("imputer", SimpleImputer(strategy="constant", fill_value=0)),
                    ]
                ),
                numeric_features,
            ),
        ]
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("classifier", RandomForestClassifier(
                n_estimators=200,
                max_depth=8,
                min_samples_split=2,
                random_state=42
            )),
        ]
    )

    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()
