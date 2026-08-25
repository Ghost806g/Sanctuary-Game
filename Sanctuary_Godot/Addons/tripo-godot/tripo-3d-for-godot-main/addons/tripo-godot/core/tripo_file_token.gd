## Representation for a tripo file token. Used for image generations and so on.
class_name TripoFileToken extends Resource
var type := ""
var token := ""
func to_dic() -> Dictionary:
	return \
	{
		"type": type,
		"file_token": token
	}
