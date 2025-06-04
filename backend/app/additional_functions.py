import json
import datetime

def to_json(value):
    if isinstance(value, (datetime.datetime, datetime.date)):
        return value.isoformat()
    return str(value)

def rows_to_json_list(rows, colnames):
    result = []
    for row in rows:
        item = {}
        for i in range(len(colnames)):
            item[colnames[i]] = row[i]
        result.append(item)

    return result

def extract_level_data(data):
    try:
        level_name = data.get("level_name")
        task = data.get("task")
        public = data.get("public", False)
        setup = data.get("setup", {})
        person_image = data.get("person_image", "person1.png")
        automat_image = data.get("automat_image", "automat1.png")

        required_fields = ["transition_values", "accepted_values"]
        for field in required_fields:
            if field not in setup or not setup[field]:
                return {"error": f"Missing required field in setup: {field}"}

        final_setup = {
            "transition_values": setup["transition_values"],
            "accepted_values": setup["accepted_values"],
            "alphabet_count": setup["alphabet_count"],
        }

        optional_fields = ["accept_all", "forbidden_values", "sequences", "accept_all_sequences", "max_input_length", "type", "alphabet_count"]
        for field in optional_fields:
            if field in setup:
                final_setup[field] = setup[field]

        extracted_data = {
            "level_name": level_name,
            "task": task,
            "public": public,
            "setup": final_setup,
            "automat_image": automat_image,
            "person_image": person_image,
        }
        return extracted_data
    except Exception as e:
        return {"error": str(e)}
