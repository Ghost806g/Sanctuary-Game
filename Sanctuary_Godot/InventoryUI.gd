extends Control

# Uma lista de slots de textura na tela (você vai adicionar TextureRects e arrastar aqui)
@export var bag_slots: Array[TextureRect]

# O Slot da Arma Equipada (você vai arrastar um TextureRect aqui)
@export var weapon_slot: TextureRect

func _ready():
	InventoryManager.inventory_updated.connect(update_inventory_ui)
	update_inventory_ui()

func update_inventory_ui():
	# Desenha a Arma Equipada (se houver)
	var arma = InventoryManager.equipment["arma"]
	if arma != null and arma.icon != null:
		weapon_slot.texture = arma.icon
	else:
		weapon_slot.texture = null
		
	# Desenha a Mochila
	for i in range(bag_slots.size()):
		if i < InventoryManager.bag.size():
			var item = InventoryManager.bag[i]
			if item.icon != null:
				bag_slots[i].texture = item.icon
		else:
			bag_slots[i].texture = null

# Simulação de equipar a primeira coisa da mochila (para testarmos o botão)
func _on_equip_button_pressed():
	if InventoryManager.bag.size() > 0:
		var item_to_equip = InventoryManager.bag[0]
		InventoryManager.equip_item(item_to_equip, "arma")
		update_inventory_ui()
