extends Resource
class_name ItemData

# Identificadores
@export var id: String = ""
@export var name: String = "Novo Item"
@export_enum("arma", "capacete", "armadura", "luvas", "botas", "escudo", "anel", "colar", "consumivel", "consumivel_hp", "consumivel_mp", "lore_fragment", "relic") var type: String = "arma"
@export var icon: Texture2D

# Raridade e Descrição
@export_enum("Normal", "Raro", "Épico", "Lendário", "Mítico") var rarity: String = "Normal"
@export_multiline var desc: String = ""

# Atributos Numéricos
@export var damage: int = 0
@export var defense: int = 0
@export var power: int = 0
@export var max_durability: int = 100
@export var durability: int = 100

# Sockets (Runas) — futuro
@export var max_sockets: int = 0

# Efeito Especial Intrínseco
@export var intrinsic_label: String = ""
@export var intrinsic_type: String = ""
@export var intrinsic_value: float = 0.0

# Passivos Bônus (futuro)
# @export var bonus_passives: Array = []

# Helper: Retorna a cor da raridade
func get_rarity_color() -> Color:
	match rarity:
		"Normal": return Color(0.7, 0.7, 0.7)
		"Raro": return Color(0.4, 0.6, 1.0)
		"Épico": return Color(0.66, 0.33, 0.97)
		"Lendário": return Color(1.0, 0.75, 0.0)
		"Mítico": return Color(1.0, 0.2, 0.2)
		_: return Color.WHITE

# Helper: É equipável?
func is_equippable() -> bool:
	return type in ["arma", "capacete", "armadura", "luvas", "botas", "escudo", "anel", "colar"]

# Helper: É consumível?
func is_consumable() -> bool:
	return type.begins_with("consumivel")
