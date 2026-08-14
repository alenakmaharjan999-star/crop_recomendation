"""
Custom Random Forest Implementation from Scratch
No scikit-learn, no frameworks - pure Python + NumPy
"""

import numpy as np
import math
from collections import Counter


class DecisionTreeNode:
    """Represents a node in a decision tree"""

    def __init__(self):
        self.feature_index = None  # Which feature to split on
        self.threshold = None  # Threshold value for split
        self.left = None  # Left child (<= threshold)
        self.right = None  # Right child (> threshold)
        self.is_leaf = False  # Is this a leaf node?
        self.prediction = None  # Prediction if leaf node
        self.class_counts = None  # Class distribution if leaf


class DecisionTree:
    """
    Pure implementation of Decision Tree
    Supports both classification and probability prediction
    """

    def __init__(self, max_depth=None, min_samples_split=2,
                 min_samples_leaf=1, criterion='gini',
                 max_features=None, n_features=None):
        self.max_depth = max_depth if max_depth else float('inf')
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.criterion = criterion
        self.max_features = max_features
        self.n_features = n_features
        self.root = None
        self.n_classes = None
        self.classes = None

    def fit(self, X, y):
        """Build the decision tree"""
        X = np.array(X)
        y = np.array(y)

        self.n_features = X.shape[1]
        self.classes = np.unique(y)
        self.n_classes = len(self.classes)

        # Determine max_features
        if self.max_features is None:
            self.max_features = self.n_features
        elif self.max_features == 'sqrt':
            self.max_features = int(np.sqrt(self.n_features))
        elif self.max_features == 'log2':
            self.max_features = int(np.log2(self.n_features))
        elif isinstance(self.max_features, float):
            self.max_features = int(self.max_features * self.n_features)
        else:
            self.max_features = int(self.max_features)

        # Build tree recursively
        self.root = self._build_tree(X, y, depth=0)
        return self

    def _build_tree(self, X, y, depth):
        """Recursively build the tree"""
        n_samples = len(y)
        n_classes = len(np.unique(y))

        # Check stopping criteria
        if (depth >= self.max_depth or
                n_samples < self.min_samples_split or
                n_classes == 1):
            return self._create_leaf_node(y)

        # Get random subset of features
        feature_indices = self._get_random_features()

        # Find best split
        best_split = self._find_best_split(X, y, feature_indices)

        if best_split is None or best_split['gain'] <= 0:
            return self._create_leaf_node(y)

        # Split the data
        left_indices = best_split['left_indices']
        right_indices = best_split['right_indices']

        # Check if split is valid (both sides have enough samples)
        if len(left_indices) < self.min_samples_leaf or len(right_indices) < self.min_samples_leaf:
            return self._create_leaf_node(y)

        # Recursively build left and right subtrees
        left_subtree = self._build_tree(X[left_indices], y[left_indices], depth + 1)
        right_subtree = self._build_tree(X[right_indices], y[right_indices], depth + 1)

        # Create internal node
        node = DecisionTreeNode()
        node.feature_index = best_split['feature_index']
        node.threshold = best_split['threshold']
        node.left = left_subtree
        node.right = right_subtree
        node.is_leaf = False

        return node

    def _get_random_features(self):
        """Select random subset of features"""
        if self.max_features >= self.n_features:
            return list(range(self.n_features))
        return np.random.choice(
            self.n_features,
            size=self.max_features,
            replace=False
        ).tolist()

    def _find_best_split(self, X, y, feature_indices):
        """Find the best split using Gini or Entropy"""
        best_gain = -1
        best_split = None
        n_samples = len(y)

        current_impurity = self._calculate_impurity(y)

        for feature_idx in feature_indices:
            feature_values = X[:, feature_idx]
            unique_values = np.unique(feature_values)

            # Try each unique value as threshold
            for threshold in unique_values:
                left_indices = np.where(feature_values <= threshold)[0]
                right_indices = np.where(feature_values > threshold)[0]

                # Skip if split is too small
                if len(left_indices) < self.min_samples_leaf or len(right_indices) < self.min_samples_leaf:
                    continue

                # Calculate impurity of child nodes
                left_impurity = self._calculate_impurity(y[left_indices])
                right_impurity = self._calculate_impurity(y[right_indices])

                # Weighted impurity
                weighted_impurity = (len(left_indices) * left_impurity +
                                     len(right_indices) * right_impurity) / n_samples

                # Information gain
                gain = current_impurity - weighted_impurity

                if gain > best_gain:
                    best_gain = gain
                    best_split = {
                        'feature_index': feature_idx,
                        'threshold': threshold,
                        'left_indices': left_indices,
                        'right_indices': right_indices,
                        'gain': gain
                    }

        return best_split

    def _calculate_impurity(self, y):
        """Calculate Gini impurity or Entropy"""
        if len(y) == 0:
            return 0

        # Count class frequencies
        class_counts = np.bincount(y) if y.dtype.kind in 'iu' else Counter(y)
        if isinstance(class_counts, Counter):
            class_counts = np.array([class_counts.get(c, 0) for c in self.classes])

        probabilities = class_counts / len(y)

        if self.criterion == 'gini':
            return 1 - np.sum(probabilities ** 2)
        elif self.criterion == 'entropy':
            # Add small epsilon to avoid log(0)
            return -np.sum(probabilities * np.log2(probabilities + 1e-10))
        else:
            raise ValueError(f"Unknown criterion: {self.criterion}")

    def _create_leaf_node(self, y):
        """Create a leaf node with majority class"""
        node = DecisionTreeNode()
        node.is_leaf = True

        # Count class frequencies
        unique, counts = np.unique(y, return_counts=True)
        node.class_counts = dict(zip(unique, counts))

        # Store prediction (majority class)
        node.prediction = unique[np.argmax(counts)]
        return node

    def predict(self, X):
        """Predict class for each sample"""
        X = np.array(X)
        return np.array([self._predict_single(x, self.root) for x in X])

    def _predict_single(self, x, node):
        """Predict single sample"""
        if node.is_leaf:
            return node.prediction

        if x[node.feature_index] <= node.threshold:
            return self._predict_single(x, node.left)
        else:
            return self._predict_single(x, node.right)

    def predict_proba(self, X):
        """Return probability estimates"""
        X = np.array(X)
        return np.array([self._predict_proba_single(x, self.root) for x in X])

    def _predict_proba_single(self, x, node):
        """Get probability distribution for single sample"""
        if node.is_leaf:
            # Return probability distribution
            proba = np.zeros(self.n_classes)
            for class_val, count in node.class_counts.items():
                class_idx = np.where(self.classes == class_val)[0][0]
                proba[class_idx] = count / sum(node.class_counts.values())
            return proba

        if x[node.feature_index] <= node.threshold:
            return self._predict_proba_single(x, node.left)
        else:
            return self._predict_proba_single(x, node.right)


class RandomForest:
    """
    Pure Random Forest Implementation
    No external libraries except NumPy
    """

    def __init__(self, n_estimators=100, max_depth=None, min_samples_split=2,
                 min_samples_leaf=1, criterion='gini', max_features='sqrt',
                 random_state=None):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.criterion = criterion
        self.max_features = max_features
        self.random_state = random_state

        self.trees = []
        self.classes = None
        self.n_features = None
        self.feature_importances_ = None

        # Set random seed
        if random_state:
            np.random.seed(random_state)

    def fit(self, X, y):
        """Build the random forest"""
        X = np.array(X)
        y = np.array(y)

        self.n_features = X.shape[1]
        self.classes = np.unique(y)
        n_samples = len(X)

        # Initialize feature importance
        feature_importances = np.zeros(self.n_features)

        print(f"🌳 Training {self.n_estimators} decision trees...")

        for tree_idx in range(self.n_estimators):
            # Step 1: Bootstrap Sampling (Bagging)
            bootstrap_indices = np.random.choice(
                n_samples,
                size=n_samples,
                replace=True
            )

            X_bootstrap = X[bootstrap_indices]
            y_bootstrap = y[bootstrap_indices]

            # Step 2: Create and train decision tree
            tree = DecisionTree(
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                min_samples_leaf=self.min_samples_leaf,
                criterion=self.criterion,
                max_features=self.max_features,
                n_features=self.n_features
            )

            tree.fit(X_bootstrap, y_bootstrap)
            self.trees.append(tree)

            # Calculate feature importance for this tree
            tree_importance = self._calculate_tree_importance(tree)
            feature_importances += tree_importance

            if (tree_idx + 1) % 10 == 0:
                print(f"   Trained {tree_idx + 1}/{self.n_estimators} trees")

        # Normalize feature importances
        total_importance = np.sum(feature_importances)
        if total_importance > 0:
            self.feature_importances_ = feature_importances / total_importance
        else:
            self.feature_importances_ = np.ones(self.n_features) / self.n_features

        print("✅ Training complete!")
        return self

    def _calculate_tree_importance(self, tree):
        """Calculate feature importance for a single tree"""
        # Simplified: Count how many times each feature is used for splitting
        importance = np.zeros(self.n_features)

        def traverse(node):
            if node.is_leaf:
                return
            importance[node.feature_index] += 1
            if node.left:
                traverse(node.left)
            if node.right:
                traverse(node.right)

        traverse(tree.root)

        # Normalize within tree
        total = np.sum(importance)
        if total > 0:
            importance = importance / total

        return importance

    def predict(self, X):
        """Make predictions using majority voting"""
        X = np.array(X)
        n_samples = len(X)

        # Get predictions from all trees
        all_predictions = np.array([tree.predict(X) for tree in self.trees])

        # Step 5: Majority voting
        final_predictions = []
        for i in range(n_samples):
            # Get predictions for this sample from all trees
            tree_predictions = all_predictions[:, i]

            # Find most common prediction (majority vote)
            unique, counts = np.unique(tree_predictions, return_counts=True)
            majority_vote = unique[np.argmax(counts)]
            final_predictions.append(majority_vote)

        return np.array(final_predictions)

    def predict_proba(self, X):
        """Get probability predictions"""
        X = np.array(X)
        n_samples = len(X)
        n_classes = len(self.classes)

        # Get probability predictions from all trees
        all_probas = np.zeros((self.n_estimators, n_samples, n_classes))

        for tree_idx, tree in enumerate(self.trees):
            tree_probas = tree.predict_proba(X)
            all_probas[tree_idx] = tree_probas

        # Average probabilities across trees
        avg_probas = np.mean(all_probas, axis=0)

        return avg_probas

    def score(self, X, y):
        """Calculate accuracy"""
        predictions = self.predict(X)
        return np.mean(predictions == y)