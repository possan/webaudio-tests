import random
import re
import os
import Cookie
import jinja2

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__ ) + "/../"))


class BasePage:
  def render(self, template_file, template_values):
    template = jinja_environment.get_template(template_file)
    self.response.out.write(template.render(template_values))


def generate_random(len):
  word = ''
  for i in range(len):
    word += random.choice('0123456789')
  return word


# Random string 0-9, a-z, A-Z
def generate_randomstr(len):
  word = ''
  for i in range(len):
    word += random.choice('123456789abcdef')
  return word