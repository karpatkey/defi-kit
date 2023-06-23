from pathlib import Path
import json

header = "// This file is auto-generated. Do not edit!\n\n"

def dump(dict, protocol, filename = '_info.ts'):
    output_path = (Path(__file__).parent / '../sdk/src/protocols' / protocol / filename).resolve()
    content = header + "export default " + json.dumps(dict, indent = 2) + " as const\n"

    f = open(output_path, "w")
    f.write(content)
    f.close()

    print("Successfully updated " + str(output_path))