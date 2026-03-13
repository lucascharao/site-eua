#!/usr/bin/env python3
"""Deploy to Vercel via API - bypasses CLI issues"""
import os, json, hashlib, base64, urllib.request, sys

TOKEN = "vcp_68UaUvYdFRQgSMYwT4kwHhU2tuhQQ3fCOaVrvtJ8g97E6apipF1i1wkc"
PROJECT = "grout-about-site"
BASE = "/Users/lucascharao/Documents/site-eua/site-usa"
SKIP = {'.git-bak', '.git', 'node_modules', '.next', '.vercel', '.env', '.env.local', 'deploy.py'}

def api(method, path, data=None, content_type="application/json"):
    url = f"https://api.vercel.com{path}"
    body = json.dumps(data).encode() if data else None
    if content_type == "application/octet-stream" and isinstance(data, bytes):
        body = data
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Content-Type", content_type)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read())

def upload_file(content_bytes, retries=3):
    sha = hashlib.sha1(content_bytes).hexdigest()
    size = len(content_bytes)
    import time
    for attempt in range(retries):
        try:
            url = f"https://api.vercel.com/v2/files"
            req = urllib.request.Request(url, data=content_bytes, method="POST")
            req.add_header("Authorization", f"Bearer {TOKEN}")
            req.add_header("Content-Type", "application/octet-stream")
            req.add_header("x-vercel-digest", sha)
            req.add_header("x-vercel-size", str(size))
            with urllib.request.urlopen(req, timeout=30) as resp:
                resp.read()
            return sha, size
        except urllib.error.HTTPError as e:
            if e.code == 409:
                return sha, size
            if attempt == retries - 1:
                raise
        except Exception as e:
            if attempt == retries - 1:
                raise
            print(f"    Retry {attempt+1}...")
            time.sleep(2)
    return sha, size

def collect_files():
    files = []
    for root, dirs, filenames in os.walk(BASE):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for f in filenames:
            if f in SKIP or f.startswith('.env'):
                continue
            full = os.path.join(root, f)
            rel = os.path.relpath(full, BASE)
            files.append((rel, full))
    return files

def main():
    print("Collecting files...")
    files = collect_files()
    print(f"Found {len(files)} files")

    file_entries = []
    for i, (rel, full) in enumerate(files):
        with open(full, 'rb') as f:
            content = f.read()
        print(f"  [{i+1}/{len(files)}] Uploading {rel} ({len(content)} bytes)")
        sha, size = upload_file(content)
        file_entries.append({
            "file": rel,
            "sha": sha,
            "size": size
        })

    print(f"\nCreating deployment...")
    deploy_data = {
        "name": PROJECT,
        "files": file_entries,
        "project": PROJECT,
        "target": "production",
        "projectSettings": {
            "framework": "nextjs",
            "buildCommand": "next build",
            "outputDirectory": ".next",
            "installCommand": "npm install"
        }
    }

    result = api("POST", "/v13/deployments", deploy_data)

    url = result.get("url", "")
    state = result.get("readyState", result.get("status", ""))
    print(f"\nDeployment created!")
    print(f"  URL: https://{url}")
    print(f"  State: {state}")
    print(f"  ID: {result.get('id', '')}")
    print(f"\nProduction URL: https://grout-about-site.vercel.app")

if __name__ == "__main__":
    main()
