import os
import webapp2
import random
import logging
import jinja2
import Cookie
import json

from google.appengine.ext import db
from google.appengine.api import users

from app.common import *
from app.model import *


def set_cookie(handler, cookie, value):
  C1 = Cookie.SimpleCookie()
  C1[cookie] = value
  handler.response.headers.add_header("Set-Cookie", C1.output(header=''))


def get_user_cookie(handler):
  #webapp2.RequestHandler
  if handler.request.get('randomuser'):
    c = generate_random(10);
    set_cookie(handler, 'user', c)
    return c
  c = handler.request.get('user')
  if c:
    set_cookie(handler, 'user', c)
    return c
  c = ''
  if 'user' in handler.request.cookies:
    c = handler.request.cookies['user']
  if not c:
    c = generate_random(10);
    set_cookie(handler, 'user', c)
  return c


class NewDocHandler(webapp2.RequestHandler, BasePage):
  def get(self):
    sessionid = get_user_cookie(self)
    self.render('templates/editor2.html', {
        'session': sessionid,
        'document': '',
        'owner': sessionid,
        'data': 'null',
        'original': '',
        'can_save': False,
        'can_fork': False,
        'can_create': True
      })


class OldDocHandler(webapp2.RequestHandler, BasePage):
  def get(self, blobid):
    sessionid = get_user_cookie(self)
    doc = BlobHelper.load(blobid)
    self.render('templates/editor2.html', {
        'session': sessionid,
        'document': blobid,
        'owner': doc['owner'],
        'data': doc['data'],
        'original': doc['forkedfrom'],
        'can_save': (doc['owner'] == sessionid),
        'can_fork': True,
        'can_create': False
      })


class CreateBlobHandler(webapp2.RequestHandler):
  def post(self):
    sessionid = get_user_cookie(self)
    data = self.request.get('data')
    logging.info('Create blob, session='+sessionid+', data='+data)
    newid = BlobHelper.create(data, sessionid)
    if newid:
      logging.info('Save to a new blob and return new id '+newid)
      # self.redirect('/'+id)
      self.response.write('{\"success\":true, \"url\":\"/'+newid+'\"}')
    else:
      # self.response.write('Unable to save!')
      self.response.write('{\"success\":false, \"error\":\"unable to save.\"}')


class LoadBlobHandler(webapp2.RequestHandler):
  def get(self, blobid):
    doc = BlobHelper.load(blobid)
    out = {
      'id': blobid,
      'revision': doc['revision'],
      'owner': doc['owner'],
      'data': doc['data'],
      'original': doc['forkedfrom']
    }
    self.response.write(json.dumps(out))


class SaveBlobHandler(webapp2.RequestHandler):
  def post(self, blobid):
    sessionid = get_user_cookie(self)
    data = self.request.get('data')
    logging.info('Save blob '+blobid+', session='+sessionid+', data='+data)
    BlobHelper.save(blobid, data, sessionid)
    self.response.write('{\"success\":true, \"url\":\"/'+blobid+'\"}')


class ForkBlobHandler(webapp2.RequestHandler):
  def post(self, blobid):
    sessionid = get_user_cookie(self)
    data = self.request.get('data')
    newid = BlobHelper.fork(blobid, data, sessionid)
    logging.info('Fork blob with id '+blobid+', session '+sessionid+', to new id '+newid+', data='+data)
    self.response.write('{\"success\":true, \"url\":\"'+newid+'\"}')