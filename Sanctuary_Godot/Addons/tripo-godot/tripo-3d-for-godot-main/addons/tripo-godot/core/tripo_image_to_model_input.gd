## The input components used to 'image to model' generation.
## Should be coherent and up-to-date with the API documents.
class_name TripoImageToModelInput extends TripoInput

## The fllowings are model generations specific options:

## Must be set to 'image_to_model'.
const type : String = "image_to_model"

## (Optional): Model version.
@export_enum(
	"Turbo-v1.0-20250506",
	"v1.4-20240625",
	"v2.0-20240919",
	"v2.5-20250123",
	"v3.0-20250812",
) var model_version : String = "v2.5-20250123"

## Specifies the image input.
@export var file : TripoFileToken = null

## (Optional): This is the random seed for model generation. For model_version>=v2.0-20240919, 
## the seed controls the geometry generation process, ensuring identical models when the same seed is used.
## This parameter is an integer and is randomly chosen if not set.
@export var model_seed : int = 0

## The options below are only valid for model_version >= v2.0-20240919:

## (Optional): Limits the number of faces on the output model.
## If this option is not set, the face limit will be adaptively determined.
@export var face_limit : int = 0

## (Optional): A boolean option to enable texturing.
## The default value is true, set false to get a base model without any textures.
@export var texture : bool = true

## (Optional): A boolean option to enable pbr. The default value is true, set false to get a model without pbr.
## If this option is set to true, texture will be ignored and used as true.
@export var pbr : bool = true

## (Optional): This is the random seed for texture generation for model_version>=v2.0-20240919.
## Using the same seed will produce identical textures.
## This parameter is an integer and is randomly chosen if not set.
## If you want a model with different textures, please use same model_seed and different texture_seed.
@export var texture_seed : int = 0

## (Optional): Determines the prioritization of texture alignment in the 3D model.
## The default value is original_image.
## original_image: Prioritizes visual fidelity to the source image.
## This option produces textures that closely resemble the original image but may result in minor 3D inconsistencies.
## geometry: Prioritizes 3D structural accuracy.
## This option ensures better alignment with the model’s geometry
## but may cause slight deviations from the original image appearance.
@export_enum("original_image", "geometry") var texture_alignment : String = "original_image"

## (Optional): This parameter controls the texture quality. detailed provides high-resolution textures,
## resulting in more refined and realistic representation of intricate parts.
## This option is ideal for models where fine details are crucial for visual fidelity. The default value is standard.
@export_enum("standard", "detailed") var texture_quality : String = "standard"

## (Optional): Automatically scale the model to real-world dimensions, with the unit in meters.
## The default value is false.
@export var auto_size : bool = false

## (Optional): Defines the artistic style or transformation to be applied to the 3D model,
## altering its appearance according to preset options. Omit this option to keep the original style and apperance.
@export_enum(
	"none",
	"person:person2cartoon",
	"object:clay",
	"object:steampunk",
	"animal:venom",
	"object:barbie",
	"object:christmas",
	"gold",
	"ancient_bronze",
) var style : String = "none"

## (Optional): Set orientation=align_image to automatically rotate the model to align the original image.
## The default value is default.
@export_enum("default", "align_image") var orientation : String = "default"

## (Optional): Set true to enable quad mesh output. If quad=true and face_limit is not set,
## the default face_limit will be 10000.
## Note: Enabling this option will force the output to be an FBX model.
@export var quad : bool = false

##  (Optional): Specifies the compression type to apply to the texture. Available values are:
## "" (empty string): No compression (default)
## geometry: Applies geometry-based compression to optimize the output, By default we use meshopt compression.
@export_enum("none", "geometry") var compress : String = "none"

## (Optional): Generate low-poly meshes with hand‑crafted topology.
## Inputs with less complexity work best. There is a possibility of failure for complex models.
## The default value is false.
@export var smart_low_poly : bool = false

## (Optional): Generate segmented 3D models and make each part editable. The default value is false.
## Note: generate_parts is not compatible with texture=true, if you want to generate parts,
## please set texture=false; generate_parts is not compatible with quad=true,
## if you want to generate parts, please set quad=false.
@export var generate_parts : bool = false

## Check whether the input compatible.
func validate() -> bool:
	if file == null:
		push_error("image input file is null! Please check your tripo file token...")
		return false
	
	# 2.0 options:
	if model_version in TripoGodot.version_2_0:
		# generate parts needs texture and quad = false
		if generate_parts:
			if texture:
				push_error("generate_parts requires texture=false!")
				return false
			if quad:
				push_error("generate_parts requires quad=false!")
				return false

	return true

# Convert to request dictionnary.
func to_request_dict() -> Dictionary:
	var dict = {
		"type": type,
		"model_version": model_version,
		"file": file.to_dic()
	}
	
	# All verisons optional handle:
	if model_seed != 0:
		dict["model_seed"] = model_seed

	# If the model verison >= v2.0, add following options to dic.
	if model_version in TripoGodot.version_2_0:
		if face_limit > 0:
			dict["face_limit"] = face_limit
		dict["texture"] = texture
		dict["pbr"] = pbr
		if texture_seed != 0:
			dict["texture_seed"] = texture_seed
		if texture_alignment != "original_image":
			dict["texture_alignment"] = texture_alignment
		if texture_quality != "standard": 
			dict["texture_quality"] = texture_quality
		if auto_size: 
			dict["auto_size"] = true
		if style != "none":
			dict["style"] = style
		if orientation != "default":
			dict["orientation"] = orientation
		if quad: 
			dict["quad"] = true
		if compress != "none": 
			dict["compress"] = compress
		if smart_low_poly: 
			dict["smart_low_poly"] = true
		if generate_parts: 
			dict["generate_parts"] = true
	
	return dict
