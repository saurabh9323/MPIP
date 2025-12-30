import os
import psycopg2 # pyright: ignore[reportMissingModuleSource]
from psycopg2.extras import RealDictCursor # type: ignore

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        cursor_factory=RealDictCursor
    )
