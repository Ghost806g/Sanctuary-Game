@tool
class_name TripoGodotPlugin extends EditorPlugin

## The default config file path, used to initialize configs.
const default_config_path := "res://addons/tripo-godot/config.ini"
const menu_path := "res://addons/tripo-godot/editor/tripo_editor.tscn"

static var credit: int
## The main menu for editor.
static var menu: Control
## The balance request.
static var balance_request: HTTPRequest

static func on_balance_request_completed(result, response_code, headers, body: PackedByteArray):
	var response = TripoGodot.deserialize(body.get_string_from_utf8())
	if result != HTTPRequest.RESULT_SUCCESS:
		push_error("Get balance request failed! Response body: %s" %response)
		credit = -1
		return
	if response.has("data"):
		credit = response.data["balance"]
	else:
		credit = -1
		push_error("Unable to get the balance response! Response body: %s" %response)
	
func _enter_tree():
	menu = preload(menu_path).instantiate()
	add_control_to_dock(EditorPlugin.DOCK_SLOT_RIGHT_UR, menu)
	balance_request = HTTPRequest.new()
	balance_request.request_completed.connect(on_balance_request_completed)
	menu.add_child(balance_request)

func _exit_tree():
	balance_request.request_completed.disconnect(on_balance_request_completed)
	balance_request.free()
	remove_control_from_docks(menu)
	menu.free()

## Get the remains credit of a account represented by specific API key.
static func get_credit(account: String) -> int:
	var headers := \
	[
		TripoGodot.build_content_type,
		TripoGodot.authorization % account
	]
	
	if balance_request.request(TripoGodot.balance_url, headers, HTTPClient.METHOD_GET) != OK:
		push_error("Get balance request failed!")
		return -1
		
	await balance_request.request_completed
	return credit

static func _static_init() -> void:
	# Read config if exists:
	if FileAccess.file_exists(default_config_path):
		read_config(default_config_path)

## Read a config file which contains base info about tripo godot.
static func read_config(path: String):
	if !FileAccess.file_exists(path):
		push_error("Config file do not exists.")
		return
	var config = ConfigFile.new()
	if config.load(path) != OK:
		push_error("Config file can not open!")
		return
		
	if config.has_section("user"): TripoGodot.api_key = config.get_value("user", "api_key")
