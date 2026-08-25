extends Node

# =========================================================================
# INVENTORY MANAGER - Gerenciamento de Inventário e Equipamentos
# Traduzido fielmente de main_v3.js (equipItemFromInventory, unequipItem, etc.)
# =========================================================================

signal item_equipped(item: Dictionary, slot: String)
signal item_unequipped(item: Dictionary, slot: String)
signal item_added(item: Dictionary)
signal item_removed(item: Dictionary)
signal item_disassembled(item: Dictionary, gold_return: int, materials: Dictionary)
signal inventory_changed()

# Slots de equipamento válidos
const EQUIPMENT_SLOTS = [
	"arma", "capacete", "armadura", "luvas", "botas",
	"escudo", "anel1", "anel2", "colar1", "colar2"
]

# Mapeamento de tipo de item para slot de equipamento
func _get_slot_for_type(hero, item_type: String) -> String:
	match item_type:
		"anel":
			return "anel2" if hero.equipment.anel1 else "anel1"
		"colar":
			return "colar2" if hero.equipment.colar1 else "colar1"
		_:
			return item_type

# === Adicionar Item ao Inventário ===
func add_item(hero, item: Dictionary) -> bool:
	hero.inventory.append(item)
	emit_signal("item_added", item)
	emit_signal("inventory_changed")
	return true

# === Remover Item do Inventário por Índice ===
func remove_item_at(hero, index: int) -> Dictionary:
	if index < 0 or index >= hero.inventory.size():
		return {}
	var item = hero.inventory[index]
	hero.inventory.remove_at(index)
	emit_signal("item_removed", item)
	emit_signal("inventory_changed")
	return item

# === Equipar Item do Inventário ===
func equip_item(hero, index: int) -> Dictionary:
	if index < 0 or index >= hero.inventory.size():
		return { "success": false, "msg": "Índice inválido." }
	
	var item = hero.inventory[index]
	var slot_key = _get_slot_for_type(hero, item.type)
	
	return equip_item_to_slot(hero, index, slot_key)

# === Equipar Item em Slot Específico ===
func equip_item_to_slot(hero, index: int, slot_key: String) -> Dictionary:
	if index < 0 or index >= hero.inventory.size():
		return { "success": false, "msg": "Índice inválido." }
	
	if not slot_key in hero.equipment:
		return { "success": false, "msg": "Slot '%s' não existe." % slot_key }
	
	var item = hero.inventory[index]
	var current_equipped = hero.equipment[slot_key]
	
	# Equipar o novo item
	hero.equipment[slot_key] = item
	hero.inventory.remove_at(index)
	
	# Se tinha algo equipado, volta pro inventário
	if current_equipped:
		hero.inventory.append(current_equipped)
	
	emit_signal("item_equipped", item, slot_key)
	emit_signal("inventory_changed")
	return { "success": true, "msg": "Equipado: %s → %s" % [item.name, slot_key] }

# === Desequipar Item ===
func unequip_item(hero, slot_key: String) -> Dictionary:
	if not slot_key in hero.equipment:
		return { "success": false, "msg": "Slot '%s' não existe." % slot_key }
	
	var item = hero.equipment[slot_key]
	if not item:
		return { "success": false, "msg": "Slot vazio." }
	
	hero.equipment[slot_key] = null
	hero.inventory.append(item)
	
	emit_signal("item_unequipped", item, slot_key)
	emit_signal("inventory_changed")
	return { "success": true, "msg": "Desequipado: %s" % item.name }

# === Desmontar Item (Disassemble) ===
func disassemble_item(hero, index: int) -> Dictionary:
	if index < 0 or index >= hero.inventory.size():
		return { "success": false }
	
	var item = hero.inventory[index]
	var base_power = item.get("power", item.get("damage", 10))
	
	# Calcular recompensas
	var gold_return = int(base_power * 1.5)
	var material_amount = int(base_power / 8) + 2
	
	var good_mats = ["mithril", "prata", "ouro_bruto", "esmeralda", "adamantium", "diamante", "lagrima_divina"]
	var common_mats = ["ferro", "cobre", "couro", "carvao"]
	
	var gained_materials = {}
	
	for i in range(material_amount):
		var chosen_mat: String
		if randf() < 0.45 and item.get("rarity", "Normal") != "Normal":
			chosen_mat = good_mats[randi() % good_mats.size()]
		else:
			chosen_mat = common_mats[randi() % common_mats.size()]
		
		if not hero.has("materials"):
			hero["materials"] = {}
		hero.materials[chosen_mat] = hero.materials.get(chosen_mat, 0) + 1
		gained_materials[chosen_mat] = gained_materials.get(chosen_mat, 0) + 1
	
	hero.gold += gold_return
	hero.inventory.remove_at(index)
	
	emit_signal("item_disassembled", item, gold_return, gained_materials)
	emit_signal("inventory_changed")
	return { "success": true, "gold": gold_return, "materials": gained_materials, "item_name": item.name }

# === Vender Tudo (Sell Trash Loot) ===
func sell_all_items(hero) -> Dictionary:
	if hero.inventory.is_empty():
		return { "success": false, "msg": "O Vazio cósmico reside em seu Inventário." }
	
	var profit = 0
	for item in hero.inventory:
		match item.get("rarity", "Normal"):
			"Normal": profit += 15
			"Magico": profit += 45
			"Raro": profit += 150
			_: profit += 600
	
	hero.gold += profit
	hero.inventory.clear()
	
	emit_signal("inventory_changed")
	return { "success": true, "msg": "💰 Mercador Goblin comprou tudo por %d Moedas!" % profit, "profit": profit }

# === Calcular Stats dos Equipamentos (computeLiveStats helper) ===
func calc_equip_stats(hero, passives: Dictionary) -> Dictionary:
	var gear_atk = 0
	var gear_def = 0
	var set_counts = {}
	
	for slot_key in hero.equipment:
		var item = hero.equipment[slot_key]
		if not item:
			continue
		
		# Contar sets
		if item.has("set"):
			set_counts[item.set] = set_counts.get(item.set, 0) + 1
		
		var item_atk = item.get("damage", item.get("power", 0))
		var item_def = item.get("defense", item.get("power", 0))
		
		# Aplicar modificadores de traits
		if HeroTraitsSystem:
			var mods = HeroTraitsSystem.getEquipStatsMod(hero, item, item_atk, item_def)
			item_atk = mods.atk
			item_def = mods.def
		
		# Distribuir para ataque ou defesa baseado no slot
		if slot_key in ["arma", "anel1", "anel2", "colar1", "colar2"]:
			gear_atk += item_atk
		else:
			gear_def += item_def
		
		# Passivas intrínsecas
		if item.has("intrinsic") and item.intrinsic.has("type"):
			if passives.has(item.intrinsic.type):
				passives[item.intrinsic.type] += item.intrinsic.value
		
		# Passivas de sockets/runas
		if item.has("sockets"):
			for rune in item.sockets:
				if rune and rune.has("effect"):
					_apply_rune_effect(rune.effect, passives)
	
	# Aplicar bônus de Sets completos
	_apply_set_bonuses(set_counts, passives)
	
	return { "gearAtk": gear_atk, "gearDef": gear_def }

# --- Helpers internos ---
func _apply_rune_effect(effect: Dictionary, passives: Dictionary):
	for key in effect:
		if key == "burn":
			passives["burnPower"] = passives.get("burnPower", 0) + effect.burn.get("power", 0)
			passives["burnDuration"] = max(passives.get("burnDuration", 0), effect.burn.get("duration", 0))
		elif passives.has(key):
			passives[key] += effect[key]

func _apply_set_bonuses(set_counts: Dictionary, passives: Dictionary):
	if not passives.has("epicPassives"):
		passives["epicPassives"] = []
	
	# Verificar BOSS_SETS e ELITE_SETS do Database
	var all_sets = []
	if Database.has("BOSS_SETS"):
		for boss_key in Database.BOSS_SETS:
			all_sets.append(Database.BOSS_SETS[boss_key])
	if Database.has("ELITE_SETS"):
		for elite_key in Database.ELITE_SETS:
			all_sets.append(Database.ELITE_SETS[elite_key])
	
	for set_name_key in set_counts:
		var count = set_counts[set_name_key]
		for set_def in all_sets:
			if set_def.get("setName") == set_name_key:
				for p in set_def.get("passives", []):
					if count >= p.req:
						if str(p.type).begins_with("epic_"):
							if not p.type in passives.epicPassives:
								passives.epicPassives.append(p.type)
						elif passives.has(p.type):
							passives[p.type] += p.value
