import os
import webapp2
import random
import logging
import jinja2
import Cookie
import datetime
from google.appengine.ext import db
from google.appengine.api import users
from app.common import *

class Blob(db.Model):
  forkedfrom = db.StringProperty()
  data = db.TextProperty(required=True)
  owner = db.StringProperty(required=True)
  created = db.DateTimeProperty()
  updated = db.DateTimeProperty()
  lastrevision = db.IntegerProperty()

class BlobRevision(db.Model):
  blobkey = db.StringProperty(required=True)
  data = db.TextProperty(required=True)
  revision = db.IntegerProperty()
  created = db.DateTimeProperty()

class BlobHelper:

  @staticmethod
  def _updateBlobAndRevision(blobid, blobdata, session, forkee=None):
    # load and update blob
    old = Blob.get_by_key_name(blobid)
    nrev = 1
    if old:
      if old.owner != session:
        raise "Trying to overwrite others' work"
        return False
      if old.data == blobdata:
        logging.info("Not saving identical data...")
        # no change, skip saving silently
        return True
      old.data = blobdata
      old.updated = datetime.datetime.now()
      nrev = old.lastrevision
      old.lastrevision = nrev + 1
      old.put()
      # update blob
    else:
      # create initial blob
      neu = Blob(
          key_name = blobid,
          created = datetime.datetime.now(),
          data = blobdata,
          owner = session,
          lastrevision = 1
        )
      if forkee:
        neu.forkedfrom = forkee
      neu.put()
    # insert a backlog item
    rev = BlobRevision(
        blobkey = blobid,
        data = blobdata,
        revision = nrev,
        created = datetime.datetime.now()
      )
    rev.put()
    logging.info("Saved blob "+blobid+" (revision "+str(nrev)+", owner "+session+")")
    return True

  @staticmethod
  def _loadBlob(blobid):
    # load blob
    old = Blob.get_by_key_name(blobid)
    if not old:
      raise "Not available"
      return one
    return old

  @staticmethod
  def load(blobid):
    blob = BlobHelper._loadBlob(blobid)
    if not blob:
      return None
    return {
        'id': blobid,
        'data': blob.data,
        'owner': blob.owner,
        'revision': blob.lastrevision,
        'forkedfrom': blob.forkedfrom
      }

  @staticmethod
  def save(blobid, blobdata, session):
    blob = BlobHelper._loadBlob(blobid)
    if blob.owner != session:
      raise "Trying to overwrite others' work"
      return False
    return BlobHelper._updateBlobAndRevision(blobid, blobdata, session)

  @staticmethod
  def fork(blobid, blobdata, session):
    # load blob
    newid = generate_randomstr(10)
    if BlobHelper._updateBlobAndRevision(newid, blobdata, session, blobid):
      return newid
    return None

  @staticmethod
  def create(blobdata, session):
    newid = generate_randomstr(10)
    if BlobHelper._updateBlobAndRevision(newid, blobdata, session):
      return newid
    return None