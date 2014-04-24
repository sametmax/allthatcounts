#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    Dev server, busting the HTML5 app cache.

    Usage:
      devserver.py [<host>] [<port>] [--with-cache]

    Options:
      -h --help        Show this screen.
      --with-cache     Don't but cache.

"""

import os
import sys

ROOT_DIR = os.path.dirname(os.path.realpath(__file__))
LIBS_DIR = os.path.join(ROOT_DIR, "libs")
sys.path.append(LIBS_DIR)

import docopt

from bottle import (Bottle, run, static_file,   abort)

app = Bottle()
arguments = docopt.docopt(__doc__)

@app.route('/')
def index():
    return static_file("index.html", root=ROOT_DIR)

if not arguments["--with-cache"]:
    @app.route('/cache.manifest', methods=['HEAD', 'GET'])
    def bust_cache_manifest():
        abort(404, "No cache")
else:
    @app.route('/cache.manifest', methods=['HEAD', 'GET'])
    def bust_cache_manifest():
        response = static_file("cache.manifest", root=ROOT_DIR)
        response.headers['Cache-Control'] = 'no-cache'
        return response



@app.route('/<filename:path>')
def serve_static(filename):
    return static_file(filename, root=ROOT_DIR)

if __name__ == "__main__":
    host = arguments["<host>"] or "localhost"
    port = int(arguments["<port>"] or 8080)
    run(app, host=host, port=port, porreloader=True)
