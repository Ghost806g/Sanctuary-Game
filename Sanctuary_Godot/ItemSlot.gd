extends TextureRect
class_name ItemSlot

@export var slot_type: String = "bag" # Pode ser "bag", "arma", "capacete", etc.
@export var is_equipment_slot: bool = false
var item: ItemData = null

func set_item(new_item: ItemData):
	item = new_item
	if item != null and item.icon != null:
		texture = item.icon
	else:
		texture = null

# O que acontece quando clico e arrasto
func _get_drag_data(at_position: Vector2):
	if item == null:
		return null
		
	# Cria o ícone fantasma que segue o mouse
	var drag_preview = TextureRect.new()
	drag_preview.texture = texture
	drag_preview.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	drag_preview.custom_minimum_size = size
	drag_preview.modulate.a = 0.8
	
	var control = Control.new()
	control.add_child(drag_preview)
	drag_preview.position = -0.5 * size
	set_drag_preview(control)
	
	# Os dados que estamos carregando
	return {
		"item": item,
		"source_slot": self
	}

# Esse slot aceita o item que está sendo arrastado?
func _can_drop_data(at_position: Vector2, data: Variant) -> bool:
	if typeof(data) != TYPE_DICTIONARY or not data.has("item"):
		return false
		
	var dragged_item = data["item"] as ItemData
	
	# Se for um slot de equipamento, só aceita o tipo certo
	if is_equipment_slot:
		# anel1/anel2 aceitam tipo "anel", colar1/colar2 aceitam tipo "colar"
		var base_type = slot_type.rstrip("0123456789")
		if dragged_item.type != slot_type and dragged_item.type != base_type:
			return false
			
	return true

# O que acontece quando solto o item aqui
func _drop_data(at_position: Vector2, data: Variant):
	var source_slot = data["source_slot"] as ItemSlot
	var dragged_item = data["item"] as ItemData
	
	# Evita arrastar para o mesmo slot
	if source_slot == self:
		return
		
	# Lógica do InventoryManager
	if is_equipment_slot and source_slot.slot_type == "bag":
		# Da mochila para equipamento
		InventoryManager.equip_item(dragged_item, slot_type)
	elif slot_type == "bag" and source_slot.is_equipment_slot:
		# De equipamento para mochila
		InventoryManager.unequip_item(source_slot.slot_type)
	elif slot_type == "bag" and source_slot.slot_type == "bag":
		# Troca de posição na mochila (Opcional, no futuro, precisa de array indexado)
		# Por enquanto não faz nada especial
		pass
