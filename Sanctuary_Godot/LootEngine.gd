extends Node

# =========================================================================
# LOOT ENGINE - Geração Procedural de Itens (traduzido de CombatEngine.js)
# =========================================================================

# === Tipos de Equipamento ===
var ITEM_TYPES = [
	{ "id": "arma", "names": ["Espada", "Lâmina", "Machado", "Montante", "Foice", "Maça", "Katar"] },
	{ "id": "capacete", "names": ["Elmo", "Coroa", "Capuz", "Máscara", "Diadema", "Protetor"] },
	{ "id": "armadura", "names": ["Placa", "Couraça", "Manto", "Veste", "Armadura", "Cota"] },
	{ "id": "luvas", "names": ["Manoplas", "Luvas", "Braçadeiras", "Punhos"] },
	{ "id": "botas", "names": ["Botas", "Grevas", "Passos", "Sapatos"] },
	{ "id": "escudo", "names": ["Escudo", "Égide", "Baluarte", "Broquel", "Defensor"] },
	{ "id": "anel", "names": ["Anel", "Selo", "Aliança", "Aro"] },
	{ "id": "colar", "names": ["Amuleto", "Colar", "Pingente", "Talismã"] }
]

var ADJECTIVES = [
	"Esquecido(a)", "Corrompido(a)", "Sanguinário(a)", "Imortal", "Abissal",
	"Radiante", "Sombrio(a)", "Profano(a)", "Divino(a)", "Infernal",
	"do Rei Louco", "das Catacumbas", "do Arauto"
]

var RARITIES = [
	{ "name": "Comum", "chance": 45, "passives": 0, "mult": 1.0 },
	{ "name": "Incomum", "chance": 30, "passives": 0, "mult": 1.3 },
	{ "name": "Raro", "chance": 15, "passives": 1, "mult": 1.8 },
	{ "name": "Epico", "chance": 7.5, "passives": 2, "mult": 2.5 },
	{ "name": "Lendario", "chance": 2.3, "passives": 3, "mult": 4.0 },
	{ "name": "Mitico", "chance": 0.2, "passives": 4, "mult": 7.5 }
]

# === Geração Procedural de Loot ===
func generate_procedural_loot(dungeon_lvl: int, force_rarity = null, enemy = null) -> Dictionary:
	# Determinar raridade
	var rarity_obj = null
	
	if force_rarity:
		for r in RARITIES:
			if r.name == force_rarity:
				rarity_obj = r
				break
		if not rarity_obj:
			rarity_obj = RARITIES[0]
	else:
		var roll = randf() * 100.0
		var current = 0.0
		for r in RARITIES:
			current += r.chance
			if roll <= current:
				rarity_obj = r
				break
		if not rarity_obj:
			rarity_obj = RARITIES[0]
	
	# Escolher tipo e nome base
	var item_type = ITEM_TYPES[randi() % ITEM_TYPES.size()]
	var base_name = item_type.names[randi() % item_type.names.size()]
	var adj = ADJECTIVES[randi() % ADJECTIVES.size()]
	
	# Calcular poder
	var power_base = dungeon_lvl * 7 + 20
	var final_power = int(power_base * rarity_obj.mult * (0.8 + randf() * 0.4))
	
	# Verificar se o inimigo pertence a um Set
	var set_name = ""
	if enemy and enemy.has("baseName"):
		var clean_name = enemy.baseName
		# Limpar sufixos tipo [Elite]
		var bracket_pos = clean_name.find(" [")
		if bracket_pos != -1:
			clean_name = clean_name.substr(0, bracket_pos)
		
		if Database.has("BOSS_SETS") and Database.BOSS_SETS.has(clean_name):
			set_name = Database.BOSS_SETS[clean_name].setName
		elif Database.has("ELITE_SETS") and Database.ELITE_SETS.has(clean_name):
			set_name = Database.ELITE_SETS[clean_name].setName
	
	var final_name = "%s da %s" % [base_name, set_name] if set_name else "%s %s" % [base_name, adj]
	
	# Montar item
	var item = {
		"id": "proc_%d_%d" % [Time.get_ticks_msec(), randi() % 1000],
		"name": final_name,
		"type": item_type.id,
		"rarity": rarity_obj.name,
		"desc": "Peça do conjunto lendário: %s." % set_name if set_name else "Um equipamento imbuído com as energias do andar %d." % dungeon_lvl,
		"durability": 100 + int(dungeon_lvl * 2),
		"maxDurability": 100 + int(dungeon_lvl * 2)
	}
	
	if set_name:
		item["set"] = set_name
	
	# Atribuir stat principal
	if item.type == "arma":
		item["damage"] = final_power
	elif item.type in ["capacete", "armadura", "luvas", "botas", "escudo"]:
		item["defense"] = final_power
	else:
		item["power"] = final_power
	
	# Gerar passivas procedurais (baseado na raridade)
	if rarity_obj.passives > 0 and Database.has("ITEM_PASSIVES_POOL"):
		var pool = Database.ITEM_PASSIVES_POOL.duplicate(true)
		var selected_passives = []
		
		for i in range(rarity_obj.passives):
			if pool.is_empty():
				break
			var idx = randi() % pool.size()
			var passive = pool[idx].duplicate(true)
			passive.value = passive.value * (rarity_obj.mult * 0.7)
			
			if passive.has("label"):
				if "%" in passive.label:
					passive.label = passive.label.replace(
						str(int(passive.value * 100)) + "%",
						str(int(passive.value * 100)) + "%"
					)
			
			selected_passives.append(passive)
			pool.remove_at(idx)
		
		if selected_passives.size() > 0:
			item["intrinsic"] = selected_passives[0]
			if selected_passives.size() > 1:
				item["bonusPassives"] = selected_passives.slice(1)
	
	return item

# === Gerar múltiplos itens de loot ===
func generate_loot_drop(dungeon_lvl: int, count: int = 1, enemy = null) -> Array:
	var drops = []
	for i in range(count):
		drops.append(generate_procedural_loot(dungeon_lvl, null, enemy))
	return drops

# === Cor da Raridade (para UI futura) ===
func get_rarity_color(rarity_name: String) -> Color:
	match rarity_name:
		"Comum": return Color(0.7, 0.7, 0.7)       # Cinza
		"Incomum": return Color(0.3, 0.8, 0.3)      # Verde
		"Raro": return Color(0.3, 0.5, 1.0)         # Azul
		"Epico": return Color(0.6, 0.2, 0.8)        # Roxo
		"Lendario": return Color(1.0, 0.6, 0.0)     # Laranja
		"Mitico": return Color(1.0, 0.2, 0.2)       # Vermelho
		_: return Color.WHITE
