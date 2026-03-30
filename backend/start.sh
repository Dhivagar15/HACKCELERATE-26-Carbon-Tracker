#!/bin/bash

echo "Starting ScopeZero Backend..."

# Create database if it doesn't exist
echo "Initializing database..."
python init_db.py

# Start the FastAPI server
echo "Starting FastAPI server..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload