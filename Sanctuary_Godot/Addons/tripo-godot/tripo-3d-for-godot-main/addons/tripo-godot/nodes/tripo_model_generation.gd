## The abstraction of task which generates a model. Provides functions to download, save, or convert the glb file.
class_name TripoModelGeneration extends TripoTask

## The binary data of downloaded glb file.
var glb_buffer: PackedByteArray
## The size of downloaded glb file in kilo bytes.
var glb_size: float:
	get:
		if glb_buffer != null:
			return glb_buffer.size() / 1024.0
		else:
			return 0

func finish_download(body: PackedByteArray):
	# Reserve the glb data.
	glb_buffer = body
	is_downloading = false
	has_downloaded = true
	clear_request_callbacks()
	logs("%s Download finished. Task id: %s. Download glb buffer size (kb): %.2f" %  [ name, task_id, glb_size ])
	downloaded.emit()
	
func on_download_pbr_model_completed(result, response_code, headers, body: PackedByteArray):
	if !check_request_result(result, response_code, body, "download pbr model"): return
	finish_download(body)

func on_download_model_completed(result, response_code, headers, body: PackedByteArray):
	if !check_request_result(result, response_code, body, "download model"): return
	finish_download(body)

func on_download_base_model_completed(result, response_code, headers, body: PackedByteArray):
	if !check_request_result(result, response_code, body, "download base model"): return
	finish_download(body)

func download() -> TaskError:
	if !has_finished: 
		return TaskError.eDownloadFailed
	if is_downloading || has_downloaded: 
		return TaskError.eDownloadRepeat
	if output == null: 
		push_warning("%s Task Output data is empty!" %name)
		return TaskError.eDownloadFailed
		
	logs("%s download start!" %name)
	is_downloading = true
	clear_request_callbacks()
	
	if output.has("pbr_model"):
		request_completed.connect(self.on_download_pbr_model_completed)
		check_request_error(request(output["pbr_model"]), "download pbr model")
	elif output.has("model"):
		request_completed.connect(self.on_download_model_completed)
		check_request_error(request(output["model"]), "download model")
	elif output.has("base_model"):
		request_completed.connect(self.on_download_base_model_completed)
		check_request_error(request(output["base_model"]), "download base model")
	
	# Create a timer to tell console still in downloading.
	var timer = Timer.new()
	timer.one_shot = false
	timer.wait_time = 1.0
	timer.timeout.connect(func(): logs("%s downloading..." %name))
	add_child(timer)
	timer.start()
	await request_completed
	timer.free()
	return TaskError.eDownloadSuccess

## Save the glb buffer into filesystem.
func save_to_file(path: String):
	if !check_download(): return
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	doc.append_from_buffer(glb_buffer, "", state)
	doc.write_to_filesystem(state, path)

## Generate a Node3D from the glb buffer which can be added to the scene tree directly.
func save_to_node() -> Node3D:
	if !check_download(): return
	var doc = GLTFDocument.new()
	var state = GLTFState.new()
	doc.register_gltf_document_extension(GLTFDocumentExtensionConvertImporterMesh.new(), true)
	doc.append_from_buffer(glb_buffer, "", state)
	var node = doc.generate_scene(state)
	return node as Node3D
