@tool class_name TripoEditorModelPreviewGroup extends VBoxContainer

@export var camera: Camera3D
@export var camera_pivot: Node3D
@export var pivot: Node3D
@export var button_save_to: Button
@export var button_path: Button
@export var dialog_save_to: FileDialog
@export var line_save_path: LineEdit
@export var camera_rotate_velocity: float = 1.0
@export var camera_zoom_velocity := 1.0

var task: TripoModelGeneration = null
var display_node: Node3D = null
var camera_offset: Vector3
var camera_init_fov: float
var camera_pivot_init_transform: Transform3D

var focused := false
var can_be_saved: bool:
	set(value):
		button_save_to.disabled = !value
		button_path.disabled = !value
	get:
		return !button_save_to.disabled
var path: String:
	get:
		return line_save_path.text
		
func _ready() -> void:
	camera_init_fov = camera.fov
	camera_pivot_init_transform = camera_pivot.transform
	camera_offset = camera.position

func display(task: TripoModelGeneration):
	if !task.has_downloaded:
		push_warning("Task haven't download anything yet...")
		return
	if display_node != null:
		display_node.free()
	display_node = task.save_to_node()
	pivot.add_child(display_node)
	self.task = task
	
func _on_file_dialog_dir_selected(dir: String) -> void:
	## TODO: GLB support only.
	line_save_path.text = dir + "/%s.glb" %task.task_id
	
func _on_path_button_button_up() -> void:
	dialog_save_to.popup_centered_ratio()

func _on_save_to_button_button_up() -> void:
	var path = line_save_path.text
	if path == "":
		push_warning("Given path must not be empty!")
		return
	if path.get_extension() != "glb":
		push_warning("Save file's extension must be '.glb'.")
		return
	if FileAccess.file_exists(path):
		push_warning("Given path file exists, please change save path.")
		return
	task.save_to_file(path)
	EditorInterface.get_resource_filesystem().scan_sources()

func reset_camera():
	camera.fov = camera_init_fov
	camera_pivot.transform = camera_pivot_init_transform
	
func _on_sub_viewport_container_focus_entered() -> void:
	focused = true

func _on_sub_viewport_container_focus_exited() -> void:
	focused = false
	
func _input(event: InputEvent) -> void:
	if !focused: return 
	if event is InputEventKey:
		if event.keycode == KEY_ESCAPE && event.pressed:
			reset_camera()
	elif event is InputEventMouseMotion:
		# Must hold mouse left button to drag...
		if !Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT): return
		var vec = event.relative
		camera_pivot.rotation_degrees.x += -vec.y * camera_rotate_velocity
		camera_pivot.rotation_degrees.y += -vec.x * camera_rotate_velocity
		camera.position = camera_offset
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_WHEEL_UP:
			camera.fov += -camera_zoom_velocity
		if event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			camera.fov += camera_zoom_velocity
