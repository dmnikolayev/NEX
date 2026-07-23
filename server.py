#!/usr/bin/env python3
import json, os, urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
ROOT=Path(__file__).resolve().parent
UPSTREAM=os.environ.get("NEX_API_URL","").strip()
HOST=os.environ.get("NEX_HOST","0.0.0.0")
PORT=int(os.environ.get("NEX_PORT","8080"))
DEMO={"grid":{"online":True,"power":1800,"voltage":236.8,"temperature":39},"solar":{"power":1800,"today":5.2},"house":{"online":True,"power":1800,"today":5.2},"inverter":{"temperature":39},"battery":{"soc":82,"runtimeMinutes":1278,"temperature":21,"power":-420},"internet":{"online":True,"uploadMbps":24.6,"downloadMbps":186.4},"weather":{"forecast":[]},"events":[]}
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT),**kw)
    def do_GET(self):
        if self.path.split("?",1)[0]=="/api/house-state": return self.api()
        return super().do_GET()
    def api(self):
        try:
            if UPSTREAM:
                with urllib.request.urlopen(urllib.request.Request(UPSTREAM,headers={"Accept":"application/json"}),timeout=5) as r: body=r.read()
            else: body=json.dumps(DEMO,ensure_ascii=False).encode()
            self.send_response(200); self.send_header("Content-Type","application/json; charset=utf-8"); self.send_header("Cache-Control","no-store"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)
        except Exception as e:
            body=json.dumps({"error":str(e)},ensure_ascii=False).encode(); self.send_response(502); self.send_header("Content-Type","application/json; charset=utf-8"); self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)
if __name__=="__main__":
    print(f"NEX: http://{HOST}:{PORT}")
    print(f"API proxy: {UPSTREAM}" if UPSTREAM else "API mode: demo; set NEX_API_URL for ha_api.py")
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
