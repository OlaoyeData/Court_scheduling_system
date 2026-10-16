from sqlalchemy         import create_engine
from sqlalchemy.pool    import NullPool
from sqlalchemy.orm     import sessionmaker, declarative_base
from core.config        import settings


def _normalize(url: str) -> str:
    for prefix in ("postgresql+psycopg://", "postgresql+psycopg2://", "postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg2://" + url[len(prefix):]
    return url


engine = create_engine(
    _normalize(settings.DATABASE_URL),
    poolclass=NullPool,   # Supabase's pooler handles pooling; serverless functions shouldn't hold their own
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    Yields a database session and ensures it is closed after the request.
    Use as a FastAPI dependency:
        db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
