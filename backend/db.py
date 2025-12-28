import json
import os
import sqlite3
from contextlib import contextmanager
from typing import Dict, List, Optional

BASE_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(BASE_DIR, "waste_history.db")


def init_db():
    """Ensure the SQLite database and history table exist."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT,
                content_type TEXT,
                predicted_class TEXT NOT NULL,
                confidence REAL NOT NULL,
                probabilities TEXT NOT NULL,
                image_data TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        # If the table already existed without image_data, add the column (ignore failure if present)
        try:
            conn.execute("ALTER TABLE history ADD COLUMN image_data TEXT")
        except sqlite3.OperationalError:
            pass
        conn.commit()


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()


def save_history(
    filename: Optional[str],
    content_type: Optional[str],
    prediction: Dict,
    image_data: Optional[str] = None,
) -> None:
    """Persist a prediction result into the history table."""
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO history (
                filename,
                content_type,
                predicted_class,
                confidence,
                probabilities,
                image_data
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                filename,
                content_type,
                prediction.get("class"),
                float(prediction.get("confidence", 0)),
                json.dumps(prediction.get("probabilities", {})),
                image_data,
            ),
        )
        conn.commit()


def fetch_history(limit: int = 20, offset: int = 0) -> List[Dict]:
    """Return a paginated list of history entries (newest first)."""
    with get_conn() as conn:
        cursor = conn.execute(
            """
            SELECT id, filename, content_type, predicted_class, confidence, probabilities, image_data, created_at
            FROM history
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        )
        rows = cursor.fetchall()

    history = []
    for row in rows:
        hist = {
            "id": row[0],
            "filename": row[1],
            "content_type": row[2],
            "class": row[3],
            "confidence": row[4],
            "probabilities": json.loads(row[5]) if row[5] else {},
            "image_data": row[6],
            "created_at": row[7],
        }
        history.append(hist)
    return history


def clear_history() -> None:
    """Remove all history entries."""
    with get_conn() as conn:
        conn.execute("DELETE FROM history")
        conn.commit()
