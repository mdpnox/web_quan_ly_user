import os, subprocess, sys, time

BACKEND = "backend_webql"
FRONTEND = "frontend_webql/webqlu"
CONDA_ENV = "web-backend"

def run():
    tien_trinh = []
    try:
        tien_trinh.append(subprocess.Popen(f"conda run -n {CONDA_ENV} uvicorn main:app --reload", shell=True, cwd=os.path.abspath(BACKEND)))
        time.sleep(2)
        tien_trinh.append(subprocess.Popen("npm run dev", shell=True, cwd=os.path.abspath(FRONTEND)))

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        for p in tien_trinh:
            p.terminate()
        sys.exit(0)
run()