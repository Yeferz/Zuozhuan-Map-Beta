
from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker



#Base = declarative_base()

#class Locale(Base):
#    __tablename__ = "Locales"
#
#    id = Column("id", Integer, primary_key=True)
#    name = Column("name", String)
#    hanzi = Column("hanzi", String)
#    polity = Column("polity", String)
#    location = Column("location", String)
#    latitude = Column("latitude", Float)
#    longitude = Column("longitude", Float)
#    entries = Column("entries", String)
#    years = Column("years", String)

#    def __init__(place, id, name, hanzi, polity, location, latitude, longitude, entries, years):
#        place.id = id
#        place.name = name
#        place.hanzi = hanzi
#        place.polity = polity
#        place.location = location
#        place.latitude = latitude
#        place.longitude = longitude
#        place.entries = entries
#        place.years = years

#    def __repr__(place):
#        return f"({place.id}) {place.name} {place.hanzi} {place.polity} {place.location} {place.latitude} {place.longitude} {place.entries} {place.years}"

#engine = create_engine("sqlite:///mydb.db", echo=True)
#Base.metadata.create_all(bind=engine)

#Session = sessionmaker(bind=engine)
#session = Session()

Place = place(1, "Beijing", "北京", "Yan", "Beijing", 39.916668, 116.383331, "Yin Gong", "700,550")
session.add(place)
session.commit()
