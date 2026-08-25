## Abstraction for uploading resources to Tripo AI.
class_name TripoUpload extends HTTPRequest

## Used by multipart transfer formatting. Just a random string.
const multipart_boundary := "--euEROVNogrmjgop"
## Indicates the upload operation is done successfully.
const upload_success_info = "%s upload success. File path: \"%s\" File size: %.2f (kb). File token: %s"
## Indicates the upload format is not supported.
const upload_format_unspported_info = "%s upload unspported format: %s"

var api_key := ""
