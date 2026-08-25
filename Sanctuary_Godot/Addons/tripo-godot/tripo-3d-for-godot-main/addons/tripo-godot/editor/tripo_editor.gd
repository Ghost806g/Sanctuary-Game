@tool class_name TripoEditor extends Control
@export_group("Contents")
@export var timeout = 30.0
@export_group("Controls")
@export var tabc_task_type: TabContainer
@export var line_api_key: LineEdit
@export var button_confirm: Button
@export var label_credit: Label
@export var pb_progress: ProgressBar
@export var button_generate: Button
@export var button_stop: Button
@export_group("Tasks") 
@export var text_to_model: Control
@export var image_to_model: Control

const label_credit_text = "Credit : %d"

var current_task: TripoTask = null

func on_api_key_changed(str: String):
	button_generate.disabled = true
	button_confirm.disabled = false

func _ready() -> void:
	# Initialize:
	if TripoGodot.api_key != null:
		line_api_key.text = TripoGodot.api_key
	if Engine.is_editor_hint():
		TripoGodot.debug_log = true
	else:
		TripoGodot.debug_log = false
	
	line_api_key.text_changed.connect(self.on_api_key_changed)
	button_generate.disabled = true
	button_confirm.disabled = false
	label_credit.text = label_credit_text % 0

func get_time_out() -> float: return timeout
func get_api_key() -> String: return line_api_key.text
func get_tab_index() -> int: return tabc_task_type.current_tab
## If there is a task running, update it's progress.
func update_progress():
	if current_task != null:
		pb_progress.value = current_task.progress

## Clean all tasks.
func clean_tasks():
	for node in get_children():
		if node is TripoTask:
			node.free()
			
func stop_task():
	if current_task != null:
		current_task.queue_free()
		current_task = null
		pb_progress.value = 0.0
		button_stop.hide()
		button_generate.show()

func reset_buttons():
	button_generate.show()
	button_generate.disabled = false
	button_stop.hide()

## Launch a task in editor.
func launch_task(task: TripoTask):
	if current_task != null:
		current_task.free()
	current_task = task
	button_generate.hide()
	button_stop.show()
	pb_progress.value = 0.0
	task.update_once.connect(update_progress)
	task.unsuccess.connect(reset_buttons)
	add_child(task)
	await task.launch()
	task.update_once.disconnect(update_progress)
	task.unsuccess.disconnect(reset_buttons)
	reset_buttons()
	
func on_generate_button_up():
	var credit = await TripoGodotPlugin.get_credit(get_api_key())
	if credit <= 0:
		push_warning("Your credit are under 0...")
		return
	label_credit.text = label_credit_text % credit
	
	# Just call 'generate' function according to the tab index.
	match tabc_task_type.current_tab:
		0:
			text_to_model.generate()
		1:
			image_to_model.generate()

func on_confirm_button_up():
	var api_key = get_api_key()
	if api_key == "":
		push_warning("Please input your API key!")
		return
	var credit = await TripoGodotPlugin.get_credit(api_key)
	if credit == -1:
		push_error("Tripo AI connection failed! Please check you API key.")
		return
	# Confirm successfully:
	label_credit.text = label_credit_text % credit
	button_generate.disabled = false
	button_confirm.disabled = true
	TripoGodot.log_debug("Tripo AI connection confirmed! API key available: %s" %api_key)
