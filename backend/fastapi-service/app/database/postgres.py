import os
import psycopg2
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import RealDictCursor
from fastapi import HTTPException

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

_pool: SimpleConnectionPool | None = None


def init_db_pool():
    global _pool
    if _pool is None:
        try:
            _pool = SimpleConnectionPool(
                minconn=1,
                maxconn=10,
                dsn=DATABASE_URL,
                sslmode="require",
                cursor_factory=RealDictCursor,
            )
            print("✅ PostgreSQL connection pool created")
        except Exception as e:
            print("❌ Failed to create DB pool:", e)
            raise


def get_connection():
    if _pool is None:
        init_db_pool()

    try:
        return _pool.getconn()
    except Exception as e:
        print("❌ Failed to get DB connection:", e)
        raise HTTPException(
            status_code=500,
            detail="Database connection failed"
        )


def release_connection(conn):
    if conn and _pool:
        _pool.putconn(conn)
