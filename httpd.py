import http.server
import socketserver
import os
import socket

class CORSRequestHandler (http.server.SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type')
        self.send_header('Access-Control-Max-Age', 1728000)
        self.send_header('Access-Control-Allow-Credentials', 'true')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

PORT = 8080

web_dir = os.path.join(os.path.dirname(__file__), '.')
os.chdir(web_dir)

hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map['.html'] = 'text/html'

with socketserver.TCPServer((ip_address, PORT), Handler) as httpd:
    print("serving at", str('http://'+ip_address+':')+str(PORT))
    httpd.serve_forever()