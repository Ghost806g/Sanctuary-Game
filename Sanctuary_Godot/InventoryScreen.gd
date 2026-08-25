extends Control

# === Referências da UI ===
@onready var bag_grid: GridContainer = $Panel/MainHBox/BagPanel/BagScroll/BagGrid
@onready var hero_portrait: TextureRect = $Panel/MainHBox/EquipPanel/PaperdollCenter/HeroPortrait

# Slots de Equipamento (Esquerda)
@onready var slot_capacete: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/LeftSlots/SlotCapacete
@onready var slot_arma: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/LeftSlots/SlotArma
@onready var slot_luvas: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/LeftSlots/SlotLuvas
@onready var slot_anel1: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/LeftSlots/SlotAnel1
@onready var slot_colar1: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/LeftSlots/SlotColar1

# Slots de Equipamento (Direita)
@onready var slot_armadura: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/RightSlots/SlotArmadura
@onready var slot_escudo: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/RightSlots/SlotEscudo
@onready var slot_botas: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/RightSlots/SlotBotas
@onready var slot_anel2: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/RightSlots/SlotAnel2
@onready var slot_colar2: ItemSlot = $Panel/MainHBox/EquipPanel/PaperdollCenter/RightSlots/SlotColar2

# Tooltip
@onready var tooltip_panel: PanelContainer = $TooltipLayer/TooltipPanel
@onready var tooltip_name: Label = $TooltipLayer/TooltipPanel/VBox/TooltipName
@onready var tooltip_rarity: Label = $TooltipLayer/TooltipPanel/VBox/TooltipRarity
@onready var tooltip_stats: Label = $TooltipLayer/TooltipPanel/VBox/TooltipStats
@onready var tooltip_desc: Label = $TooltipLayer/TooltipPanel/VBox/TooltipDesc

# Filtros
@onready var filter_all: Button = $Panel/MainHBox/BagPanel/FilterBar/FilterAll
@onready var filter_equip: Button = $Panel/MainHBox/BagPanel/FilterBar/FilterEquip
@onready var filter_consumable: Button = $Panel/MainHBox/BagPanel/FilterBar/FilterConsumable

var item_slot_scene = preload("res://ItemSlot.tscn")
var current_filter: String = "Tudo"

# Mapeia slot_name -> ItemSlot node
var equip_slot_map: Dictionary = {}

# Tooltip tracking
var _hovered_slot: ItemSlot = null

func _ready():
	InventoryManager.inventory_updated.connect(_on_inventory_updated)
	
	# Configura todos os slots de equipamento
	_setup_equip_slot(slot_capacete, "capacete")
	_setup_equip_slot(slot_arma, "arma")
	_setup_equip_slot(slot_luvas, "luvas")
	_setup_equip_slot(slot_anel1, "anel1")
	_setup_equip_slot(slot_colar1, "colar1")
	_setup_equip_slot(slot_armadura, "armadura")
	_setup_equip_slot(slot_escudo, "escudo")
	_setup_equip_slot(slot_botas, "botas")
	_setup_equip_slot(slot_anel2, "anel2")
	_setup_equip_slot(slot_colar2, "colar2")
	
	# Conecta filtros
	filter_all.pressed.connect(func(): _set_filter("Tudo"))
	filter_equip.pressed.connect(func(): _set_filter("Equipamentos"))
	filter_consumable.pressed.connect(func(): _set_filter("Consumíveis"))
	
	$Panel/CloseButton.pressed.connect(func(): hide())
	
	tooltip_panel.hide()
	hide()
	_on_inventory_updated()

func _setup_equip_slot(slot: ItemSlot, key: String):
	slot.is_equipment_slot = true
	slot.slot_type = key
	equip_slot_map[key] = slot

func _set_filter(filter: String):
	current_filter = filter
	_on_inventory_updated()

func _process(_delta):
	if not visible:
		return
	
	# Tooltip segue o mouse e detecta hover sem flickering
	var mouse_pos = get_viewport().get_mouse_position()
	var found_slot: ItemSlot = null
	
	# Verifica todos os slots de equipamento
	for key in equip_slot_map:
		var slot = equip_slot_map[key]
		if slot.get_global_rect().has_point(mouse_pos) and slot.item != null:
			found_slot = slot
			break
	
	# Verifica slots da mochila
	if found_slot == null:
		for child in bag_grid.get_children():
			if child is ItemSlot and child.get_global_rect().has_point(mouse_pos) and child.item != null:
				found_slot = child
				break
	
	if found_slot != null and found_slot.item != null:
		_update_tooltip_content(found_slot.item)
		# Posiciona o tooltip ao lado do mouse, sem cobrir o slot
		tooltip_panel.position = mouse_pos + Vector2(20, -10)
		# Garante que não sai da tela
		var vp_size = get_viewport_rect().size
		if tooltip_panel.position.x + tooltip_panel.size.x > vp_size.x:
			tooltip_panel.position.x = mouse_pos.x - tooltip_panel.size.x - 10
		if tooltip_panel.position.y + tooltip_panel.size.y > vp_size.y:
			tooltip_panel.position.y = vp_size.y - tooltip_panel.size.y - 10
		tooltip_panel.show()
	else:
		tooltip_panel.hide()

func _on_inventory_updated():
	# Limpa a grade
	for child in bag_grid.get_children():
		child.queue_free()
	
	# Popula os slots da mochila
	for i in range(InventoryManager.max_bag_slots):
		var slot = item_slot_scene.instantiate()
		slot.slot_type = "bag"
		slot.is_equipment_slot = false
		
		if i < InventoryManager.bag.size():
			var item = InventoryManager.bag[i]
			var show = true
			if current_filter == "Equipamentos" and not item.is_equippable():
				show = false
			elif current_filter == "Consumíveis" and not item.is_consumable():
				show = false
			if show:
				slot.set_item(item)
		
		bag_grid.add_child(slot)
	
	# Atualiza equipamento
	for key in equip_slot_map:
		var equip_item = InventoryManager.equipment.get(key)
		equip_slot_map[key].set_item(equip_item)

func _update_tooltip_content(item: ItemData):
	tooltip_name.text = item.name
	tooltip_name.add_theme_color_override("font_color", item.get_rarity_color())
	tooltip_rarity.text = item.rarity
	tooltip_rarity.add_theme_color_override("font_color", item.get_rarity_color())
	
	var stats_text = ""
	if item.damage > 0:
		stats_text += "⚔ Dano: %d\n" % item.damage
	if item.defense > 0:
		stats_text += "🛡 Defesa: %d\n" % item.defense
	if item.power > 0:
		stats_text += "⚡ Poder: +%d\n" % item.power
	if item.durability > 0 and item.is_equippable():
		stats_text += "🔨 Durabilidade: %d/%d\n" % [item.durability, item.max_durability]
	if item.intrinsic_label != "":
		stats_text += "✨ %s\n" % item.intrinsic_label
	tooltip_stats.text = stats_text
	tooltip_desc.text = '"%s"' % item.desc if item.desc != "" else ""

# Fecha ao clicar fora
func _input(event):
	if event is InputEventMouseButton and event.pressed and visible:
		var rect = $Panel.get_global_rect()
		if not rect.has_point(event.position):
			hide()
