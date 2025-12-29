# Waste Classification 

A modern model to classify waste into **Organic**, **Anorganic**, or **Mixed** categories using a deep learning model.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm

## Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd Klasifikasi-Sampah
    ```

2.  **Backend Setup**:
    ```bash
    # Install dependencies
    pip install -r backend/requirements.txt
    ```


## How to Run

### 1. Start the Backend (API)
Open a terminal in the root directory:
```bash
uvicorn backend.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.


## Features
- **AI Classification**: Open Postman Upload an image to detect waste type.

Link Model>https://drive.google.com/drive/folders/1hV-m1O7G4Vew5EcLBM1mO1CmHXybACtU?usp=drive_link