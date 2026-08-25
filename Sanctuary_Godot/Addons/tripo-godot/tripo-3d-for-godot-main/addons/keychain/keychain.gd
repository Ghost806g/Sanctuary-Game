@tool
class_name Keychain
extends Resource

@export var key: String = ""
@export var iv: String = ""
@export var file_path: String = ""
@export var delimiter: String = "="

@export_tool_button("Assign Random Key 16") var key_16_callable: Callable = self.assign_rand_key_16
@export_tool_button("Assign Random Key 32") var key_32_callable: Callable = self.assign_rand_key_32
@export_tool_button("Assign Random IV") var iv_callable: Callable = self.assign_rand_iv
@export_tool_button("Encrypt") var encrypt_callable: Callable = self.encrypt
@export_tool_button("Decrypt") var decrypt_callable: Callable = self.decrypt

## For further compatibilities, use the hex codes.
static var codes: String = "abcdef0123456789"

static func rand_code() -> String:
	var index := randi() % codes.length()
	return codes[index]
	
static func rand_key(length: int) -> String:
	var result: String = ""
	for i in range(length):
		result += rand_code()
	return result

func update(path: String, mode: AESContext.Mode, flag: int, clear: bool = false) -> bool:
	if not FileAccess.file_exists(file_path):
		push_warning("Keychain file do not exist!")
		return false
	
	var data = FileAccess.get_file_as_bytes(file_path)
	if data.is_empty():
		var error = FileAccess.get_open_error()
		if error == OK:
			push_warning("Keychain file is empty...")
			return false
		printerr(error_string(FileAccess.get_open_error()))
	
	print("Data size : %s Bytes" % data.size())
	if data.size() % 16 != 0:
		@warning_ignore_start("integer_division")
		var desire_size := (data.size() / 16 + 1) * 16
		data.resize(desire_size)
		print("Aligned data size : %s Bytes" % data.size())
		@warning_ignore_restore("integer_division")
	
	var aes = AESContext.new()
	aes.start(mode, key.to_utf8_buffer(), iv.to_utf8_buffer())
	var buffer = aes.update(data)
	aes.finish()
	
	var file = FileAccess.open(path, FileAccess.READ_WRITE)
	file.resize(0)
	file.store_buffer(buffer)
	file.store_8(flag)
	file.flush()
	file.close()
	
	print("Update successfully!")
	return true
	
func clear_empty() -> bool:
	if not FileAccess.file_exists(file_path):
		push_warning("Keychain file do not exist!")
		return false
	var file_string = FileAccess.get_file_as_string(file_path)
	file_string = file_string.replace(" ", "")
	
	var file = FileAccess.open(file_path, FileAccess.READ_WRITE)
	file.resize(0)
	file.store_string(file_string)
	file.flush()
	file.close()
	
	return true
	
func assign_rand_key_16() -> String:
	key = rand_key(16)
	return key
	
func assign_rand_key_32() -> String:
	key = rand_key(32)
	return key

func assign_rand_iv() -> String:
	iv = rand_key(16)
	return iv

func peek_flag() -> int:
	if not FileAccess.file_exists(file_path):
		push_warning("Keychain file do not exist!")
		return false
	var file = FileAccess.open(file_path, FileAccess.READ)
	file.seek_end(-1)
	var flag = file.get_8()
	file.flush()
	file.close()
	return flag

func pop_flag() -> int:
	if not FileAccess.file_exists(file_path):
		push_warning("Keychain file do not exist!")
		return false
	var file = FileAccess.open(file_path, FileAccess.READ_WRITE)
	file.seek_end(-1)
	var flag = file.get_8()
	file.resize(file.get_length() - 1)
	file.flush()
	file.close()
	return flag

func is_encrypted() -> bool:
	return peek_flag() == 1

func encrypt() -> bool:
	print("Keychain encrypt start...")
	if is_encrypted():
		print("File has been encrypted...")
		return false
	return update(file_path, AESContext.MODE_CBC_ENCRYPT, 1, true)
	
func decrypt() -> bool:
	print("Keychain decrypt start...")
	if not is_encrypted():
		print("File has not be encrypted...")
		return false
	pop_flag()
	if update(file_path, AESContext.MODE_CBC_DECRYPT, 0, false):
		clear_empty()
		return true
	return false

func read() -> Dictionary[String, String]:
	if is_encrypted():
		push_error("Keychain is still encrypted! Please decrypt it before reading...")
		return {}
	var file = FileAccess.open(file_path, FileAccess.READ)
	var dic: Dictionary[String, String] = {}
	var line: String = ""
	while true:
		line = file.get_line()
		if line == "": break
		var data := line.split(delimiter)
		if data.size() >= 2:
			dic[data[0]] = data[1]
	return dic
	
func peek() -> Dictionary[String, String]:
	if is_encrypted():
		decrypt()
	var dic := read()
	encrypt()
	return dic
