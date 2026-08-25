# 🎧 Noise Detection Using AI

An AI-powered **Noise Detection and Classification System** that uses **Deep Learning models (CNN and RNN)** to identify and classify different types of environmental and audio noise.

The project combines **audio signal processing, feature extraction, CNN, and RNN architectures** to build an intelligent system capable of learning patterns from audio signals and detecting the type of noise present in an input audio file.

---

## 🚀 Project Overview

Noise is present in almost every real-world environment, including roads, industries, offices, homes, airports, and public places.

Traditional noise detection systems often depend on predefined thresholds or manually engineered rules. This project uses **Artificial Intelligence and Deep Learning** to automatically learn meaningful patterns from audio data.

The system processes an audio signal, extracts important audio features, and passes them through deep learning models to classify the noise.

### Main Deep Learning Models

* 🧠 **CNN (Convolutional Neural Network)**
* 🔄 **RNN (Recurrent Neural Network)**

The models are designed to learn both:

* **Spatial/frequency patterns** from audio representations
* **Temporal patterns** present in audio signals

---

## 🎯 Objectives

The main objectives of this project are:

* Detect noise from audio signals.
* Classify different types of environmental noise.
* Extract meaningful features from raw audio.
* Compare CNN and RNN performance.
* Build an AI-based automated noise classification system.
* Improve noise recognition using multiple audio features.
* Develop a model that can be used in real-world applications.

---

## 🏗️ Project Workflow

```text
                    Audio Dataset
                         │
                         ▼
                  Data Collection
                         │
                         ▼
                  Audio Preprocessing
                         │
                         ▼
                 Feature Extraction
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
      MFCC          Mel Spectrogram      Chroma
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                  Feature Processing
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
             CNN                   RNN
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
                  Noise Prediction
                         │
                         ▼
                Noise Classification
```

---

## 📂 Dataset

The model can be trained using an environmental sound/noise dataset containing different categories of sounds.

Example classes can include:

* 🚗 Car/Traffic Noise
* 🚨 Siren
* 🔨 Construction Noise
* 🏭 Industrial Noise
* ✈️ Aircraft Noise
* 🗣️ Human/Background Noise
* 🐕 Animal Sounds
* 🌧️ Rain
* 🔊 Machinery
* 🎵 Music

> The exact classes depend on the dataset used for training.

---

# 🔊 Audio Processing

Audio files contain raw waveform information. Deep learning models generally perform better when useful representations of the audio signal are extracted.

The project can use **Librosa** for audio processing and feature extraction.

```python
import librosa

audio, sr = librosa.load("audio.wav", sr=None)

print("Sampling Rate:", sr)
print("Audio Length:", len(audio))
```

---

# 🧪 Feature Extraction

Multiple features can be extracted from the audio signal to provide the models with meaningful information.

## 1. MFCC

**Mel-Frequency Cepstral Coefficients (MFCC)** are one of the most commonly used features in audio classification.

```python
mfcc = librosa.feature.mfcc(
    y=audio,
    sr=sr,
    n_mfcc=40
)
```

MFCC captures important characteristics of the audio spectrum.

---

## 2. Mel Spectrogram

A Mel Spectrogram represents the energy distribution of an audio signal across different frequencies over time.

```python
mel = librosa.feature.melspectrogram(
    y=audio,
    sr=sr,
    n_mels=128
)

mel_db = librosa.power_to_db(mel, ref=np.max)
```

Mel Spectrograms are especially useful for **CNN-based audio classification**.

---

## 3. Chroma Features

Chroma features represent the energy of different pitch classes.

```python
chroma = librosa.feature.chroma_stft(
    y=audio,
    sr=sr
)
```

---

## 4. Spectral Centroid

Spectral centroid indicates the center of mass of the frequency spectrum.

```python
spectral_centroid = librosa.feature.spectral_centroid(
    y=audio,
    sr=sr
)
```

It can help distinguish sounds based on their brightness or frequency distribution.

---

## 5. Spectral Bandwidth

Spectral bandwidth measures the spread of frequencies around the spectral centroid.

```python
spectral_bandwidth = librosa.feature.spectral_bandwidth(
    y=audio,
    sr=sr
)
```

---

## 6. Spectral Rolloff

Spectral rolloff represents the frequency below which a specified percentage of the total spectral energy is contained.

```python
spectral_rolloff = librosa.feature.spectral_rolloff(
    y=audio,
    sr=sr
)
```

---

## 7. Zero Crossing Rate

Zero Crossing Rate measures how frequently the audio signal changes sign.

```python
zcr = librosa.feature.zero_crossing_rate(audio)
```

It can be useful for distinguishing noisy and percussive sounds.

---

## 8. RMS Energy

Root Mean Square energy represents the energy/intensity of an audio signal.

```python
rms = librosa.feature.rms(y=audio)
```

---

# 🧠 CNN Model

A **Convolutional Neural Network (CNN)** can be used to analyze spectrogram-based representations of audio.

The audio signal can be converted into a **Mel Spectrogram**, which behaves similarly to an image.

### CNN Architecture

```text
Input Audio
     │
     ▼
Mel Spectrogram
     │
     ▼
Conv2D
     │
     ▼
MaxPooling
     │
     ▼
Conv2D
     │
     ▼
MaxPooling
     │
     ▼
Flatten
     │
     ▼
Dense Layer
     │
     ▼
Dropout
     │
     ▼
Output Layer
     │
     ▼
Noise Class
```

Example:

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D
from tensorflow.keras.layers import Flatten, Dense, Dropout

cnn_model = Sequential([
    Conv2D(32, (3, 3), activation='relu',
           input_shape=(128, 128, 1)),

    MaxPooling2D((2, 2)),

    Conv2D(64, (3, 3), activation='relu'),

    MaxPooling2D((2, 2)),

    Conv2D(128, (3, 3), activation='relu'),

    MaxPooling2D((2, 2)),

    Flatten(),

    Dense(128, activation='relu'),

    Dropout(0.5),

    Dense(num_classes, activation='softmax')
])
```

---

# 🔄 RNN Model

Audio is a **time-series signal**, meaning that the sequence and temporal relationship between audio frames are important.

An **RNN (Recurrent Neural Network)** can learn these temporal dependencies.

The project can use:

* Simple RNN
* LSTM
* GRU

For example, an LSTM model:

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

rnn_model = Sequential([
    LSTM(128, input_shape=(time_steps, features)),
    Dropout(0.5),

    Dense(64, activation='relu'),

    Dropout(0.3),

    Dense(num_classes, activation='softmax')
])
```

### RNN Workflow

```text
Audio
  │
  ▼
Feature Extraction
  │
  ▼
Time-Series Features
  │
  ▼
LSTM / RNN
  │
  ▼
Dense Layer
  │
  ▼
Noise Classification
```

---

# ⚔️ CNN vs RNN

| Feature                  | CNN                                 | RNN                              |
| ------------------------ | ----------------------------------- | -------------------------------- |
| Main Strength            | Pattern recognition                 | Temporal patterns                |
| Input                    | Spectrogram                         | Sequential features              |
| Audio Frequency Patterns | Excellent                           | Good                             |
| Temporal Information     | Moderate                            | Excellent                        |
| Training Speed           | Generally faster                    | Generally slower                 |
| Suitable Architecture    | Mel Spectrogram                     | MFCC/Sequential Features         |
| Main Application         | Audio representation classification | Time-series audio classification |

---

# 🔬 Model Training

The dataset is divided into:

```text
Dataset
   │
   ├── Training Set
   ├── Validation Set
   └── Testing Set
```

Example:

```python
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    X_train,
    y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    batch_size=32
)
```

---

# 📊 Model Evaluation

The models can be evaluated using multiple performance metrics.

### Metrics

* Accuracy
* Precision
* Recall
* F1-Score
* Confusion Matrix
* ROC-AUC (where applicable)

Example:

```python
from sklearn.metrics import classification_report

y_pred = model.predict(X_test)

print(classification_report(
    y_test,
    y_pred_classes
))
```

---

# 📈 Visualization

Training and validation performance can be visualized using accuracy and loss curves.

```python
import matplotlib.pyplot as plt

plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])

plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.legend(["Training", "Validation"])

plt.show()
```

Similarly, loss can be plotted to identify **overfitting or underfitting**.

---

# 🗂️ Project Structure

```text
Noise-Detection-AI/
│
├── dataset/
│   ├── train/
│   ├── validation/
│   └── test/
│
├── notebooks/
│   ├── EDA.ipynb
│   ├── feature_extraction.ipynb
│   ├── CNN_model.ipynb
│   └── RNN_model.ipynb
│
├── models/
│   ├── cnn_model.h5
│   └── rnn_model.h5
│
├── src/
│   ├── preprocessing.py
│   ├── feature_extraction.py
│   ├── cnn.py
│   ├── rnn.py
│   └── prediction.py
│
├── app/
│   └── app.py
│
├── requirements.txt
│
├── README.md
│
└── LICENSE
```

---

# 🛠️ Technologies Used

### Programming Language

* Python 🐍

### Machine Learning / Deep Learning

* TensorFlow
* Keras
* Scikit-learn

### Audio Processing

* Librosa
* SoundFile

### Data Processing

* NumPy
* Pandas

### Visualization

* Matplotlib
* Seaborn

### Development

* Jupyter Notebook
* VS Code

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/Noise-Detection-AI.git
```

Navigate into the project:

```bash
cd Noise-Detection-AI
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# ▶️ How to Run

### Step 1 — Prepare Dataset

Place the audio dataset inside the `dataset/` directory.

### Step 2 — Extract Features

Run:

```bash
python src/feature_extraction.py
```

### Step 3 — Train CNN

```bash
python src/cnn.py
```

### Step 4 — Train RNN

```bash
python src/rnn.py
```

### Step 5 — Make Prediction

```bash
python src/prediction.py
```

---

# 💡 Future Improvements

Future versions of the project can include:

* 🎙️ Real-time microphone noise detection
* 📱 Mobile application
* 🌐 Web-based noise detection system
* 🔊 Real-time noise monitoring
* 📍 Location-based noise mapping
* 🤖 CNN-LSTM hybrid architecture
* ⚡ Real-time streaming prediction
* 📊 Noise pollution dashboard
* ☁️ Cloud deployment
* 🚀 Model optimization for edge devices

---

# 🌍 Real-World Applications

This system can potentially be used in:

* 🏙️ Smart city noise monitoring
* 🚗 Traffic monitoring
* 🏭 Industrial noise monitoring
* ✈️ Airport noise monitoring
* 🏠 Smart home systems
* 🏥 Hospital environment monitoring
* 🚨 Emergency sound detection
* 🎧 Audio surveillance and monitoring
* 🌆 Environmental pollution monitoring

---

# 🧠 Key Concepts Used

This project combines several important AI and Data Science concepts:

```text
Python
  ↓
Data Collection
  ↓
Audio Processing
  ↓
EDA
  ↓
Feature Engineering
  ↓
MFCC / Mel Spectrogram / Chroma / ZCR / RMS
  ↓
Data Preprocessing
  ↓
CNN + RNN
  ↓
Model Training
  ↓
Model Evaluation
  ↓
Noise Classification
```

---

# 📌 Conclusion

The **Noise Detection Using AI** project demonstrates how Deep Learning can be applied to audio classification problems.

By combining **audio feature extraction, CNN-based spatial pattern learning, and RNN-based temporal sequence learning**, the system can identify different types of noise from audio data.

The project also provides a strong practical application of **Deep Learning, Signal Processing, Feature Engineering, and Time-Series Analysis**.

---

## 👨‍💻 Author

**Gurudayal Yadav**

B.Tech Computer Science Engineering Student
Interested in **Machine Learning, Artificial Intelligence, Data Science & Technology**

---

## ⭐ If You Like This Project

If you find this project useful, consider giving it a ⭐ on GitHub!
