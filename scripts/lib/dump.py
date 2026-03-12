from pathlib import Path
import json
import re
import subprocess
import shutil

header = "// This file is auto-generated. Do not edit!\n\n"

def dump(data, protocol, filename="_info.ts"):
    output_path = (Path(__file__).parent / "../../sdk/src/protocols" / protocol / filename).resolve()
    repo_root = (Path(__file__).parent / "../..").resolve()

    content = json.dumps(data, indent=2, ensure_ascii=False)
    content = re.sub(r'"([A-Za-z_][A-Za-z0-9_]*)":', r"\1:", content)
    content = header + "export default " + content + " as const\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    yarn = shutil.which("yarn") or shutil.which("yarn.cmd")
    npx = shutil.which("npx") or shutil.which("npx.cmd")

    if yarn:
        cmd = [yarn, "prettier", "--write", str(output_path)]
    elif npx:
        cmd = [npx, "prettier", "--write", str(output_path)]
    else:
        raise RuntimeError("Could not find yarn or npx in PATH")

    subprocess.run(cmd, check=True, cwd=repo_root)

    print("Successfully updated " + str(output_path))