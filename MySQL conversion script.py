#Annoyingly, it seems that SQLAlchemy does not support GIS data types

from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Float, VARCHAR, INTEGER, FLOAT, TEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


#Later on this can have a foreign_key constraint so that we can relate people and places
class locales_corrected(Base):
    __tablename__='locales_corrected'
    ogc_fid = Column(INTEGER, primary_key=True)
    field_1 = Column(VARCHAR(255))
    name = Column(VARCHAR(255), nullable=False)
    hanzi = Column(VARCHAR(255), nullable=False)
    polity = Column(VARCHAR(255), nullable=True)
    location = Column(VARCHAR(255), nullable=True)
    latitude = Column(FLOAT)
    longitude = Column(FLOAT)
    entries = Column(VARCHAR(255), nullable=False)
    field_9 = Column(VARCHAR(255))
    field_10 = Column(VARCHAR(255))
    years = Column(VARCHAR(255))

class personae(Base):
    __tablename__='personae'
    name = Column(TEXT, primary_key=True, nullable=False)
    hanzi = Column(TEXT, nullable=True)
    details = Column(TEXT, nullable=True)
    entries = Column(TEXT, nullable=True)

sqlite_engine = create_engine('sqlite:///C:/Users/naiya/Documents/GitHub/Zuozhuan-Map-Beta/Database.sqlite')

mysql_engine = create_engine('mysql+pymysql://root:Sc242hdF@localhost:4000/maindb')

SQLite_session = sessionmaker(bind=sqlite_engine)
sqlite_session = SQLite_session()


MySQLsession = sessionmaker(bind=mysql_engine)
mysql_session = MySQLsession()

Base.metadata.create_all(mysql_engine)

for table in [locales_corrected, personae]:
    records = sqlite_session.query(table).all()
    for record in records:
        mysql_session.merge(record)

mysql_session.commit()
sqlite_session.close()
mysql_session.close()