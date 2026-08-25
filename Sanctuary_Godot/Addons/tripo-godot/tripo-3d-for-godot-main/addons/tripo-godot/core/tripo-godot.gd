class_name TripoGodot

const host_url := "https://api.tripo3d.ai/v2/openapi"
const task_url := "https://api.tripo3d.ai/v2/openapi/task"
const upload_url := "https://api.tripo3d.ai/v2/openapi/upload/sts"
const balance_url := "https://api.tripo3d.ai/v2/openapi/user/balance"
const build_content_type := "Content-Type: application/json"
const upload_content_type := "Content-Type: multipart/form-data"
const authorization := "Authorization: Bearer %s"
const task_type_text_to_model := "text_to_model"
const task_type_image_to_model := "image_to_model"
const version_1_0 := ["Turbo-v1.0-20250506", "v1.4-20240625"]
## The versions greater or equal to v2.0.
const version_2_0 := ["v2.0-20240919", "v2.5-20250123", "v3.0-20250812"]

## The API key for all possible tasks later.
static var api_key: String = ""
## Indicates whether to print info about every task into the output.
static var debug_log: bool = false
static var credit: int

## The main menu for editor.
static var menu: Control
## The balance request.
static var balance_request: HTTPRequest

static func log_debug(val): if debug_log: print_debug(val)

## Deserialize string to json.
static func deserialize(str: String) -> Dictionary:
	var json = JSON.new()
	var err = json.parse(str)
	if err != OK: push_error("Json parse failed!")
	return json.data as Dictionary
