from .database import SessionLocal

# Function to get a database session and close it after the request is finished
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()