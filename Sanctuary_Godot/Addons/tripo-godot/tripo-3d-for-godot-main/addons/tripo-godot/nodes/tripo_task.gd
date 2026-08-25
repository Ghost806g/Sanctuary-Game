## Abstraction for all Tripo Tasks.
## The derive task should be implement get type function and download function according to their certain type,
## while load the resources and provide function to access them.
class_name TripoTask extends HTTPRequest

const msg_task_input_mismatch := "%s input type is not %s!"

enum TaskError
{
	eSuccess,
	eFailed,
	eRequestTimeout,
	eBuildSuccess,
	eBuildRepeat,
	eBuildFailed,
	eDownloadSuccess,
	eDownloadRepeat,
	eDownloadFailed,
}

@export var input: TripoInput = null
## Override of the global API key of TripoGodot.
var api_key: String = ""
## The remote task id.
var task_id : String = ""
## The current status of task.
var status : String = ""
## The current progress of task.
var progress : float = 0.0
## The output data after task finished. Can be used for download operations.
## TODO: Convert the output to a specific class.
var output : Dictionary

## Is this task is building.
var is_building := false
## Is this task built.
var has_built := false
## Is this task polling.
var is_polling := false
## Is this task finished.
var has_finished := false
## Is this task downloading.
var is_downloading := false
## Is this task downloaded.
var has_downloaded := false

## The interval between two polling requests.
@export var polling_interval : float = 1.0:
	set(val): polling_interval = clamp(polling_interval, 0.1, timeout)
var polling_timer : float = 0.0

## Emit every time update finished.
signal update_once
## Emit when task success.
signal success(output: Dictionary)
## Emit when task unsuccess.
signal unsuccess
## Emit when task finished, whatever it is success or not.
signal completed(status: String)
## Emit when task download successfully.
signal downloaded

func _init() -> void:
	# Auto assign the API key.
	if TripoGodot.api_key != null:
		api_key = TripoGodot.api_key

## Add a request callback.
func add_request_callback(cb: Callable): request_completed.connect(cb)

## As you can see.
func clear_request_callbacks():
	for c in request_completed.get_connections():
		request_completed.disconnect(c["callable"])
	
## Log to the output if 'debug_log' of TripoGodot is on.
func logs(str): TripoGodot.log_debug(str)

## Check the request error.
func check_request_error(err, desc: String):
	if err != OK: push_error("%s %s send request failed! Error: %s" %[ name, desc, str(err)])
		
## Check if the result of a request success.
func check_request_result(result: Result, response_code: int, response_body: PackedByteArray, desc: String) -> bool:
	if result != Result.RESULT_SUCCESS:
		unsuccess.emit()
		if result == Result.RESULT_CONNECTION_ERROR || result == Result.RESULT_CANT_CONNECT:
			push_error("%s %s request connection error! Please check your web environment..." % [ name, desc ] )
			return false
		# If the response code still 0, means the request time out and not exactly failed.
		if response_code == 0:
			push_error("%s %s request time out!" % [ name, desc ])
			return false
		else: 
			push_error("%s %s request failed! Response body: %s" % [ name, desc, str(response_body) ])
			return false
	return true

## Call after the build request completed successfully. Can be Override.
func build_completed(body: PackedByteArray):
	var response = TripoGodot.deserialize(body.get_string_from_utf8())
	# Check if the response data valid.
	if !response.has("data"): push_error("%s can not retrieve data! Build response body: %s" % [ name, response] )
	# Retrieve the task id for further usage.
	if response.data.has("task_id"): task_id = response.data["task_id"]
	else: push_error("%s bad build response: %s" % [ name, str(response) ])
	# Build successfully:
	TripoGodot.log_debug("%s build successfully! Task id: %s" % [ name, task_id ])
	
## Call after every update request completed successfully. Can be Override.
func update_completed(new_data: Dictionary):
	status = new_data["status"]
	progress = float(new_data["progress"])
	update_once.emit()
	logs("%s status: %s progress: %s" % [ name, status, str(progress)] )

func on_build_request_completed(result, response_code, headers, body: PackedByteArray):
	if !check_request_result(result, response_code, body, "build"): return
	clear_request_callbacks()
	add_request_callback(self.on_polling_request_completed)
	build_completed(body)
	# Task has already built.
	is_building = false
	has_built = true
	
func on_polling_request_completed(result, response_code, headers, body: PackedByteArray):
	if !check_request_result(result, response_code, body, "polling"): return
	var response = TripoGodot.deserialize(body.get_string_from_utf8())
	update_completed(response.data as Dictionary)
	# The task still processing.
	if status == "queued" || status == "running":
		# The pre update is done, make it 'false' for next update.
		is_polling = false
		# Return for the next update.
		return
		
	# Finished...
	clear_request_callbacks()
	is_polling = false
	has_finished = true
	
	# Check the finished status.
	if status == "success":
		# Retrieve the output.
		output = response.data["output"]
		success.emit(output)
		completed.emit(status)
		# Response data is toooooo longggg.
		#logs("%s Task success. Task id: %s Response data: \n %s" % [ name, task_id, str(response)])
		logs("%s Task success. Task id: %s" % [ name, task_id ])
	else:
		unsuccess.emit()
		completed.emit(status)
		push_error("%s Task %s! Response body: %s" % [ name, status, response ])
		
## Check if all the requirements of given type of task on ready.
## Can be override by the derives.
func check_build_task_requires() -> bool:
	# Ensure the api key exists.
	if api_key == "":
		if TripoGodot.api_key == "":
			push_error("%s No API key given, there must be a key to mobilize Tripo AI." %name)
			return false
		else: api_key = TripoGodot.api_key
	return true
	
## Start the task build process.
func build() -> TaskError:
	if is_building || has_built:
		return TaskError.eBuildRepeat
	if api_key == "":
		push_error("%s API key is empty!" %name)
		return TaskError.eBuildFailed
	if input == null:
		push_error("%s input is null!" % name)
		return TaskError.eBuildFailed
	if !input.validate():
		return TaskError.eBuildFailed
		
	logs("%s build start!" %name)
	# Construct task request headers.
	var request_headers: PackedStringArray = \
	[
		TripoGodot.build_content_type,
		TripoGodot.authorization % api_key
	]
	logs("%s build request headers: " %name + str(request_headers))
	
	# Construct task input data.
	var dic = input.to_request_dict()
	var request_body = str(dic)
	logs("%s build request body: %s" % [ name, request_body ])
		
	# Bind callback and start request.
	clear_request_callbacks()
	add_request_callback(self.on_build_request_completed)
	check_request_error(request(TripoGodot.task_url, request_headers, HTTPClient.METHOD_POST, request_body), "build")
	is_building = true
	await request_completed
	return TaskError.eBuildSuccess

## Start a polling request once. Used to update the task object,
## remember it's a async operation which means the update will
## not causing block but not always on time.
func update():
	if not has_built: return
	if is_polling || has_finished: return
	# Construct task request headers.
	var request_headers: PackedStringArray = \
	[	
		TripoGodot.authorization %api_key
	]
	# Construct target task url.
	var polling_task_url = TripoGodot.task_url + "/%s" % task_id
	
	clear_request_callbacks()
	add_request_callback(self.on_polling_request_completed)
	check_request_error(request(polling_task_url, request_headers, HTTPClient.METHOD_GET), "update")
	is_polling = true

## Check if task already download.
func check_download() -> bool:
	if !has_downloaded:
		push_error("%s haven't download anything yet!" %name)
		return false
	return true

## Download the relavant resources of this task.
func download(): pass # ... implement of derives.

## Do not override in any derives.
func _process(delta: float) -> void:
	polling_timer += delta
	if polling_timer >= polling_interval:
		polling_timer = 0.0
		update()

## A quick way to build, waiting for success and download.
func launch() -> TaskError:
	var err = await build()
	if err == TaskError.eBuildFailed:
		push_error("%s launch failed! Building Unsuccessful!" %name)
		return err
		
	await completed
	if status != "success":
		push_error("%s launch failed! Task update failed! Task status: %s" % [ name, status ])
		return TaskError.eFailed
	
	err = await download()
	if err == TaskError.eDownloadFailed:
		push_error("%s launch failed! Downloading Unsuccessful!" %name)
		return err
	
	return TaskError.eSuccess
