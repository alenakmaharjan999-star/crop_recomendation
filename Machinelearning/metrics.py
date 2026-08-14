"""
Custom Metrics Calculation from Scratch
No scikit-learn - pure Python implementation
"""

import numpy as np
from collections import Counter


def confusion_matrix(y_true, y_pred, labels=None):
    """
    Calculate confusion matrix manually
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    if labels is None:
        labels = np.unique(np.concatenate([y_true, y_pred]))

    n_labels = len(labels)
    label_to_idx = {label: idx for idx, label in enumerate(labels)}

    # Initialize confusion matrix
    cm = np.zeros((n_labels, n_labels), dtype=int)

    # Fill confusion matrix
    for true_label, pred_label in zip(y_true, y_pred):
        true_idx = label_to_idx[true_label]
        pred_idx = label_to_idx[pred_label]
        cm[true_idx][pred_idx] += 1

    return cm, labels


def accuracy_score(y_true, y_pred):
    """
    Calculate accuracy manually
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    correct = np.sum(y_true == y_pred)
    total = len(y_true)

    return correct / total


def precision_score(y_true, y_pred, average='weighted'):
    """
    Calculate precision manually
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    labels = np.unique(np.concatenate([y_true, y_pred]))

    cm, _ = confusion_matrix(y_true, y_pred, labels)
    n_classes = len(labels)

    precisions = []
    for i in range(n_classes):
        # True Positives = cm[i][i]
        # Predicted Positives = sum of column i
        tp = cm[i][i]
        predicted_positives = np.sum(cm[:, i])

        if predicted_positives == 0:
            precision = 0
        else:
            precision = tp / predicted_positives

        precisions.append(precision)

    if average == 'weighted':
        # Weighted by number of true samples per class
        class_counts = np.sum(cm, axis=1)
        total = np.sum(class_counts)
        weighted_precision = np.sum((class_counts / total) * precisions)
        return weighted_precision
    elif average == 'macro':
        return np.mean(precisions)
    else:
        return precisions


def recall_score(y_true, y_pred, average='weighted'):
    """
    Calculate recall manually
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    labels = np.unique(np.concatenate([y_true, y_pred]))

    cm, _ = confusion_matrix(y_true, y_pred, labels)
    n_classes = len(labels)

    recalls = []
    for i in range(n_classes):
        # True Positives = cm[i][i]
        # Actual Positives = sum of row i
        tp = cm[i][i]
        actual_positives = np.sum(cm[i, :])

        if actual_positives == 0:
            recall = 0
        else:
            recall = tp / actual_positives

        recalls.append(recall)

    if average == 'weighted':
        class_counts = np.sum(cm, axis=1)
        total = np.sum(class_counts)
        weighted_recall = np.sum((class_counts / total) * recalls)
        return weighted_recall
    elif average == 'macro':
        return np.mean(recalls)
    else:
        return recalls


def f1_score(y_true, y_pred, average='weighted'):
    """
    Calculate F1-score manually
    """
    precisions = precision_score(y_true, y_pred, average=None)
    recalls = recall_score(y_true, y_pred, average=None)

    f1s = []
    for p, r in zip(precisions, recalls):
        if p + r == 0:
            f1 = 0
        else:
            f1 = 2 * (p * r) / (p + r)
        f1s.append(f1)

    if average == 'weighted':
        y_true = np.array(y_true)
        labels = np.unique(y_true)
        class_counts = [np.sum(y_true == label) for label in labels]
        total = np.sum(class_counts)
        weighted_f1 = np.sum((class_counts / total) * f1s)
        return weighted_f1
    elif average == 'macro':
        return np.mean(f1s)
    else:
        return f1s


def classification_report(y_true, y_pred, labels=None):
    """
    Generate classification report manually
    """
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    if labels is None:
        labels = np.unique(np.concatenate([y_true, y_pred]))

    cm, _ = confusion_matrix(y_true, y_pred, labels)
    n_classes = len(labels)

    report = "              precision    recall  f1-score   support\n\n"

    # Per-class metrics
    for i, label in enumerate(labels):
        # Calculate metrics for this class
        tp = cm[i][i]
        fp = np.sum(cm[:, i]) - tp
        fn = np.sum(cm[i, :]) - tp
        support = np.sum(cm[i, :])

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

        report += f"   {str(label):<12} {precision:9.2f} {recall:9.2f} {f1:9.2f} {support:8d}\n"

    # Calculate weighted averages
    total_support = np.sum(np.sum(cm, axis=1))
    weighted_precision = 0
    weighted_recall = 0
    weighted_f1 = 0
    accuracy = 0

    for i in range(n_classes):
        tp = cm[i][i]
        fp = np.sum(cm[:, i]) - tp
        fn = np.sum(cm[i, :]) - tp
        support = np.sum(cm[i, :])

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

        weight = support / total_support
        weighted_precision += precision * weight
        weighted_recall += recall * weight
        weighted_f1 += f1 * weight

        # Accuracy: sum of diagonal / total
        accuracy += tp

    accuracy = accuracy / total_support if total_support > 0 else 0

    report += f"\n   {'accuracy':<12} {accuracy:9.2f}   {'':8}   {'':8} {total_support:8d}\n"
    report += f"   {'macro avg':<12} {np.mean(precision):9.2f} {np.mean(recall):9.2f} {np.mean(f1):9.2f} {total_support:8d}\n"
    report += f"   {'weighted avg':<12} {weighted_precision:9.2f} {weighted_recall:9.2f} {weighted_f1:9.2f} {total_support:8d}\n"

    return report


def confusion_matrix_display(cm, labels):
    """
    Display confusion matrix in a readable format
    """
    n = len(labels)
    print("\nConfusion Matrix:")
    print("=" * (n * 10 + 10))

    # Header
    header = "          " + "".join([f"{label:>8} " for label in labels])
    print(header)
    print("-" * (n * 10 + 10))

    # Rows
    for i, label in enumerate(labels):
        row = f"{str(label):<8} "
        for j in range(n):
            row += f"{cm[i][j]:>8} "
        print(row)
    print("=" * (n * 10 + 10))