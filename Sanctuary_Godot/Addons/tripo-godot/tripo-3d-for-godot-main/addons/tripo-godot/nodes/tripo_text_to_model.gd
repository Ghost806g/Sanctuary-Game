## Tripo Task for generating model by prompting text.
class_name TripoTextToModel extends TripoModelGeneration

func build() -> TaskError:
	# Ensure input type:
	if input is not TripoTextToModelInput:
		push_error(msg_task_input_mismatch % [ name, TripoTextToModelInput.type ])
		return TaskError.eBuildFailed
	return await super()
