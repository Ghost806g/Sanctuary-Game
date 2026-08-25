## Tripo Task for generating model by prompting text and uploaded images.
class_name TripoImageToModel extends TripoModelGeneration

func build() -> TaskError:
	# Ensure input type:
	if input is not TripoImageToModelInput: 
		push_error(msg_task_input_mismatch % [ name, TripoTextToModelInput.type ])
		return TaskError.eBuildFailed
	return await super()
