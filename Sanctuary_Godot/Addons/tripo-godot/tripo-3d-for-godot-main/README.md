# Tripo Godot
Tripo Godot is a Godot pulgin designed for Cooperation with [Tripo API](https://www.tripo3d.ai/api), Providing easy-to-use editor functionalities and features. Also fit with the runtime generation requirement.

## Features
* Native GDScript.
* Built-in Editor.
* Text to model.
* Image to model.
## Installment
Like every other GDScript plugin in Godot, just copy the `addons` folder to your godot project.
## Editor Usage Guide
### Set up API key
The `API key` is a representation of your Tripo API account, setting up the API key is the most first step to mobilize Tripo API. You can easily just type the API key into correspond input field, or create a .ini file named `config.ini` and place it side by side with the `plugin.cfg` file to persistence your API key like this:

```ini
    [user]
    api_key="Your API key" # prefix with tsk_
```

### Preview Operation
The preview panel is designed for visualize the result of generations. With following operations:
* Pressed `mouse left button` to drag the camera.
* Rotate the `mouse wheel` to zoom the fov of camera.
* Press `ESC` to reset the camera transform.

### Using Nodes
Adapted to Godot's design ideology, all the generation opertions under the editor UI are completed by Nodes. Currently, there are some available nodes can be use directly, like: `TripoTextToModel` , `TripoImageToModel` , `TripoUploadImage`.
## Runtime Usage Guide
The key for runtime usages is also about nodes. Though there is a 'core' class named `TripoGodot` which contains a bunch of global functions and properties. A traditional work flow of runtime generation is based on the __task__ and __input__, the latter contains all the infos used for task.

It's highly recommended to code with the [Tripo API Document](https://platform.tripo3d.ai/docs) in case of potential bugs.
### Basic Usages
It is quite a straightfoward pattern:

```gdscript
func _ready() -> void:
    # If haven't create 'config.ini', remember assign the API key to the core.
    # Or assign it every single task.
    TripoGodot.api_key = "Your API key"
    # Tell the core to print infos into console.
	TripoGodot.debug_log = true
	
    # Create input data.
	var input = TripoTextToModelInput.new()
	input.prompt = "a tiny dog."
    
    # Create task.
	var task = TripoTextToModel.new()
	task.input = input
	
    # Remember add the task node into tree.
	add_child(task)
	
    # Wait for task completed.
	var err = await task.launch()
	
    # Check result.
	if err != TripoTask.TaskError.eSuccess:
		return
	
    # Add the result as a node.
	add_child(task.save_to_node())
```
### Upload Operations
Upload Operations are used for image generations. Which is a little bit complex:

```gdscript	
	var up = TripoUploadImage.new()
	
	add_child(up)
	var token = await up.upload("res://logo.png")
	
	var input = TripoImageToModelInput.new()
	input.file = token
	
	var task = TripoImageToModel.new()
	task.input = input
	
	add_child(task)
	
	# Same as usual...
```

### Use Keychain Utility

In order to manage local API Key, The `Keychain` utility is provided. It can be used to store and retrieve the API Key from a specific file with encryption.

The file should be formatted as follows:

```txt
tripo_api_key=YOUR_API_KEY
other_api_key=OTHER_API_KEY
```

And read the content as follows:

```gdscript
# Assign the Keychain Resource.
@export var kc: Keychain

func _ready() -> void:
	var dic := kc.peek()
	print(dic)
```

## Future Plans
* Update-to-date with Tripo API.