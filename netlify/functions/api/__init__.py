def handler(event, context):
    print("Debug: Function invoked")
    return {
        "statusCode": 200,
        "body": "Hello from Minimal Function"
    }
