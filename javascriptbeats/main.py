#!/usr/bin/env python

import webapp2

from app.model import *
from app.web import *

app = webapp2.WSGIApplication([
  ('/blob', CreateBlobHandler),
  ('/blob/([^/$]+)', LoadBlobHandler),
  ('/blob/([^/$]+)/fork', ForkBlobHandler),
  ('/blob/([^/$]+)/save', SaveBlobHandler),
  ('/', NewDocHandler),
  ('/([^b][a-zA-Z0-9-]+)', OldDocHandler),
], debug=True)
