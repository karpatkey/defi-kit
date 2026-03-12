from pathlib import Path
import json
import re

header = "// This file is auto-generated. Do not edit!\n\n"

def dump(dict, protocol, filename='_info.ts'):
    output_path = (Path(__file__).parent / '../../sdk/src/protocols' / protocol / filename).resolve()

    content = json.dumps(dict, indent=2, ensure_ascii=False)

    # remove quotes around object keys
    content = re.sub(r'"([A-Za-z_][A-Za-z0-9_]*)":', r'\1:', content)

    content = header + "export default " + content + " as const\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    print("Successfully updated " + str(output_path))