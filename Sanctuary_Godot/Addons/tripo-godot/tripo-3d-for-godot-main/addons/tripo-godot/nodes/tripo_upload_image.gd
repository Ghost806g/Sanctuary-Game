class_name TripoUploadImage extends TripoUpload

var image_token := ""

signal upload_success(token: String)

func on_upload_completed(result, response_code, headers, body: PackedByteArray):
	var json = JSON.new()
	var err = json.parse(body.get_string_from_utf8())
	if err != OK:
		push_error("%s response data json parse failed! Response body: %s" % [ name, body.get_string_from_utf8() ])
		return
	var response = json.data as Dictionary
	var code := int(response.code)
	if code != 0:
		push_error("%s upload response failed! Response body: %s" % [ name, body.get_string_from_utf8()])
		return
	# Upload successfully.
	else:		
		image_token = response.data["image_token"]
		upload_success.emit(image_token)

## check the whether the image format are supported for uploading.
func check_upload_image_format(ext: String) -> bool:
	match ext:
		"":
			push_error(upload_format_unspported_info % [ name, ext ])
			return false
		"webp": return true
		"jpeg": return true
		"jpg": return true
		"png": return true
		_: 
			push_error(upload_format_unspported_info % [ name, ext ])
			return false

func upload(path: String) -> TripoFileToken:
	var ext = path.get_extension()
	if !check_upload_image_format(ext): return null
	# Ensure api key exists.
	if api_key == "":
		if TripoGodot.api_key == "":
			push_error("%s upload failed! Error: API key is needed!" %name)
		else: api_key = TripoGodot.api_key
		
	var request_headers = \
	[
		"Content-Type: multipart/form-data; boundary=%s" %multipart_boundary,
		TripoGodot.authorization % api_key,
	]
	
	if !FileAccess.file_exists(path):
		push_error("%s upload file do not exists!")
		return null
	
	var image_file : PackedByteArray = FileAccess.get_file_as_bytes(path)
	if image_file.size() == 0:
		push_error("%s upload image file is empty!" %name)
		return null

	# Build mulpart/form-data body
	var body = PackedByteArray()
	# Add file part
	body.append_array(("--" + multipart_boundary + "\r\n").to_utf8_buffer())
	body.append_array(('Content-Disposition: form-data; name="file"; filename="%s"\r\n' % path).to_utf8_buffer())
	body.append_array(("Content-Type: image/%s\r\n\r\n" %path.get_extension()).to_utf8_buffer())
	body.append_array(image_file)
	body.append_array("\r\n".to_utf8_buffer())

	# End boundary
	body.append_array(("--" + multipart_boundary + "--\r\n").to_utf8_buffer())

	var err = request_raw(TripoGodot.upload_url, request_headers, HTTPClient.METHOD_POST, body)
	if err != OK:
		push_error("%s upload request failed! Error code: %s" % [ name, err ])
		return null
		
	TripoGodot.log_debug("%s upload start!" %name)
	await upload_success
	TripoGodot.log_debug(upload_success_info % [ name, path, body.size() / 1024.0, image_token] )
	var token = TripoFileToken.new()
	token.type = ext
	token.token = image_token
	return token
	
func _init() -> void:
	request_completed.connect(self.on_upload_completed)
