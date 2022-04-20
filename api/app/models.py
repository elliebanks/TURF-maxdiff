import base64
import pickle
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.types import VARCHAR, TypeDecorator
from app import db


#Create new column type
class PickleEncodedDict(TypeDecorator):
    """
    Represents an immutable structure as a pickle-encoded string.
    """

    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        # tells the database how to store python variables in the database
        if value is not None:
            value = base64.b64encode(pickle.dumps(value)).decode("utf-8")
        return value

    def process_result_value(self, value, dialect):
        # tells the database how to give you back the python variable it stored
        if value is not None:
            value = pickle.loads(base64.b64decode(value.encode("utf-8")))
        return value



# Use new column type in a database table
class MaxDiffProject(db.Model):

    """Table containing MaxDiff Projects"""

    id = db.Column(db.Integer, primary_key=True)
    config = db.Column("config", MutableDict.as_mutable(PickleEncodedDict))

    def __repr__(self):
        return f"<MaxDiffProject {self.config}>"

class SubGroup(db.Model):

    """Table containing MaxDiff Projects"""

    id = db.Column(db.Integer, primary_key=True)
    config = db.Column("config", MutableDict.as_mutable(PickleEncodedDict))

    def __repr__(self):
        return f"<SubGroup {self.config}>"
#
# Base = declarative_base()
#
# class MaxDiffProject(Base):
#
#     __tablename__ = 'maxdiff data'
#     id = db.Column(db.Integer, primary_key=True)
#     config = db.Column("config", MutableDict.as_mutable(PickleEncodedDict))
#
#
# class Subgroup(Base):
#
#     __tablename__ = 'subgroup'
#     id = db.Column(db.Integer, primary_key=True)
#     config=db.Column("config",  MutableDict.as_mutable(PickleEncodedDict))
#
# Base.metadata.create_all(engine)


