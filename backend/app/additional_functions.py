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
