#Annoyingly, it seems that SQLAlchemy does not support GIS data types

from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, VARCHAR
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

#Later on this can have a foreign_key constraint so that we can relate people and places
class locale(Base):
    __tablename__='locales_corrected'
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    hanzi = Column(VARCHAR(255), nullable=False)
    polity = Column(VARCHAR(255), nullable=True)
    location = Column(VARCHAR(255), nullable=True)
    latitude = Column(Float)
    longitude = Column(Float)
    entries = Column(VARCHAR(255), nullable=False)
    years = Column(VARCHAR(255))

class personae(Base):
    __tablename__='personae'
    name = Column(VARCHAR(255), primary_key=True, nullable=False)
    hanzi = Column(String(255), nullable=True)
    details = Column(VARCHAR(255), nullable=True)
    entries = Column(VARCHAR(255), nullable=True)

sqlite_engine = create_engine('sqlite:///Database.sqlite')

mysql_engine = create_engine('mysql+pymysql://root:Sc242hdF@localhost:4000/maindb')

SQLite_session = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLite_session()

MySQLsession = sessionmaker(bind=mysql_engine)
mysql_session = MySQLsession()

Base.metadata.create_all(mysql_engine)

for table in [locale, personae]:
    records = sqlite_session.query(table).all()
    for record in records:
        mysql_session.merge(record)

mysql_session.commit()
sqlite_session.close()
mysql_session.close()