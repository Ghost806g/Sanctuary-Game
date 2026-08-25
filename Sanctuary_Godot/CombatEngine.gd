extends Node

# =========================================================================
# COMBAT ENGINE - Motor de Combate por Turnos (ATB)
# Tradução fiel de CombatEngine.js (~3100 linhas) para GDScript puro.
# Toda lógica de UI/DOM foi removida — sinais emitidos para a UI reagir.
# =========================================================================

# === SIGNALS (Substitui todo o DOM manipulation do JS) ===
signal combat_started(enemy: Dictionary)
signal combat_log(message: String, log_type: String)  # "combat", "reward", "danger", "status", "system", "normal"
signal floating_text(value, text_type: String, target: String)  # target: "hero" or "enemy"
signal hero_damaged(amount: int)
signal enemy_damaged(amount: int)
signal hero_healed(amount: int)
signal enemy_healed(amount: int)
signal hero_turn_ready()
signal enemy_turn_start(enemy: Dictionary)
signal combat_won(xp: int, gold: int, loot: Array)
signal hero_died()
signal posture_broken(target: String)
signal combo_updated(count: int, multiplier: float)
signal sanity_event(event_type: String, message: String)
signal screen_shake()

# === Estado do Combate ===
var active_enemy: Dictionary = {}
var hero_combat_state: Dictionary = {}
var combo_counter: int = 0
var is_combat_active: bool = false
var run_stats: Dictionary = {}

# === CONSTANTES ===
const DEFENSE_CONSTANT = 100
const AI_TYPES = ["aggressive", "defensive", "caster", "balanced"]
const POSSIBLE_AFFIXES = [
	{ "id": "vampiric", "name": "Vampírico" },
	{ "id": "armored", "name": "Blindado" },
	{ "id": "agile", "name": "Ágil" }
]

# =========================================================================
# INICIALIZAÇÃO DO COMBATE
# =========================================================================
func init_combat(hero, biome: Dictionary, is_boss: bool = false):
	hero_combat_state = {
		"statuses": [],
		"defBuff": 0,
		"atkBuff": 0,
		"dodge": 0,
		"activeMinions": [],
		"atb": 0.0,
		"turnReady": false,
		"position": "vanguarda",
		"orcCooldown": 0,
		"humanPotionCooldown": 0,
		"determinationTested": false,
		"barbarianLastStandUsed": false,
		"immuneToDamage": false,
		"rangerHeadshot": false
	}
	combo_counter = 0
	is_combat_active = true
	
	var lvl = hero.get("dungeonLevel", 1)
	
	if is_boss:
		active_enemy = biome.boss.duplicate(true)
		active_enemy["name"] = "☠️ %s" % active_enemy.name
		active_enemy["baseName"] = active_enemy.name
		active_enemy["isBoss"] = true
		
		# Escalonamento híbrido AAA
		var scale = 1.0 + lvl * 0.1 + (pow(1.04, lvl) - 1.0)
		active_enemy["hp"] = int(active_enemy.hp * scale)
		active_enemy["maxHp"] = active_enemy.hp
		active_enemy["atk"] = int(active_enemy.atk * scale)
		active_enemy["def"] = int(active_enemy.get("def", 10) * scale)
		active_enemy["xpDrop"] = int(active_enemy.get("xpDrop", 50) * scale)
		active_enemy["goldDrop"] = int(active_enemy.get("goldDrop", 20) * scale)
	else:
		# Monstro comum aleatório
		var idx = randi() % biome.monsters.size()
		active_enemy = biome.monsters[idx].duplicate(true)
		active_enemy["baseName"] = active_enemy.name
		active_enemy["isBoss"] = false
		
		var scale = 1.0 + (lvl - 1) * 0.08 + (pow(1.035, lvl - 1) - 1.0)
		if hero.get("hardmode", false):
			scale *= 3.0
		
		active_enemy["hp"] = int(active_enemy.hp * scale)
		active_enemy["maxHp"] = active_enemy.hp
		active_enemy["atk"] = int(active_enemy.atk * scale)
		active_enemy["def"] = int(active_enemy.get("def", 5) * scale)
		active_enemy["xpDrop"] = int(active_enemy.get("xpDrop", 10) * scale)
		active_enemy["goldDrop"] = int(active_enemy.get("goldDrop", 5) * scale)
		
		# Sistema de Afixos Elite
		active_enemy["affixes"] = []
		if lvl >= 5 and randf() < 0.25:
			var affix = POSSIBLE_AFFIXES[randi() % POSSIBLE_AFFIXES.size()]
			active_enemy.affixes.append(affix.id)
			active_enemy["name"] = "%s [%s]" % [active_enemy.name, affix.name]
			active_enemy["isElite"] = true
			active_enemy["hp"] = int(active_enemy.hp * 1.3)
			active_enemy["atk"] = int(active_enemy.atk * 1.2)
			active_enemy["baseName"] = active_enemy.name
	
	active_enemy["statuses"] = []
	active_enemy["currentHp"] = active_enemy.hp
	active_enemy["atb"] = 0.0
	
	# IA
	if not active_enemy.has("aiType"):
		active_enemy["aiType"] = AI_TYPES[randi() % AI_TYPES.size()]
	
	# Postura (Stagger)
	var posture_mult = 0.8 if is_boss else 0.4
	if active_enemy.get("affixes", []).has("armored"): posture_mult += 0.3
	if active_enemy.get("affixes", []).has("agile"): posture_mult -= 0.2
	active_enemy["maxPosture"] = max(10, int(active_enemy.maxHp * posture_mult))
	active_enemy["posture"] = active_enemy.maxPosture
	active_enemy["staggerBroken"] = false
	
	# Cooldowns da IA
	active_enemy["cooldowns"] = {}
	active_enemy["turnCounter"] = 0
	
	emit_signal("combat_started", active_enemy)
	emit_signal("combat_log", "⚔️ Combate iniciado contra %s!" % active_enemy.name, "combat")

# =========================================================================
# TICK DO ATB (chamado a cada frame ou timer)
# =========================================================================
func tick_atb(hero, delta: float = 0.05) -> String:
	if not is_combat_active or active_enemy.is_empty():
		return "idle"
	
	var hero_speed = hero.attributes.get("agilidade", 10)
	var enemy_speed = active_enemy.get("lvl", 12) + 10 if active_enemy.has("lvl") else 12
	
	# Avança ATB de ambos
	if hero_combat_state.atb < 100:
		hero_combat_state.atb = min(100.0, hero_combat_state.atb + hero_speed * 0.30 * (delta / 0.05))
		active_enemy.atb = min(100.0, active_enemy.atb + enemy_speed * 0.30 * (delta / 0.05))
	
	# Turno do inimigo
	if active_enemy.atb >= 100:
		# Processar status do inimigo primeiro
		var enemy_stat = _process_status_array(active_enemy.statuses, active_enemy.name)
		if enemy_stat.dmg > 0:
			active_enemy.hp -= enemy_stat.dmg
			active_enemy.currentHp = active_enemy.hp
			emit_signal("enemy_damaged", enemy_stat.dmg)
			emit_signal("floating_text", enemy_stat.dmg, "damage", "enemy")
			if active_enemy.hp <= 0:
				_finalize_combat_win(hero)
				return "win"
		
		# Stagger recovery
		if active_enemy.staggerBroken:
			var has_stun = false
			for st in active_enemy.statuses:
				if st.type == "stun": has_stun = true; break
			if not has_stun:
				active_enemy.posture = active_enemy.maxPosture
				active_enemy.staggerBroken = false
				emit_signal("combat_log", "🔄 O monstro recuperou sua postura defensiva!", "combat")
		
		if enemy_stat.skip or active_enemy.staggerBroken:
			active_enemy.atb = 0
			return "enemy_skip"
		else:
			emit_signal("enemy_turn_start", active_enemy)
			return "enemy_turn"
	
	# Turno do herói
	elif hero_combat_state.atb >= 100 and not hero_combat_state.turnReady:
		hero_combat_state.turnReady = true
		
		# Processar status do herói
		if hero_combat_state.statuses.size() > 0:
			var hero_stat = _process_hero_status_array(hero, hero_combat_state.statuses)
			if hero_stat.dmg > 0:
				hero.current_hp -= hero_stat.dmg
				emit_signal("hero_damaged", hero_stat.dmg)
				emit_signal("floating_text", hero_stat.dmg, "damage", "hero")
				if hero.current_hp <= 0:
					_handle_hero_death(hero)
					return "death"
			if hero_stat.skip:
				hero_combat_state.atb = 0
				hero_combat_state.turnReady = false
				return "hero_skip"
		
		emit_signal("hero_turn_ready")
		return "hero_turn"
	
	return "ticking"

# =========================================================================
# AÇÃO DO HERÓI (Ataque Básico)
# =========================================================================
func hero_basic_attack(hero) -> Dictionary:
	if not is_combat_active or hero_combat_state.atb < 100:
		return { "success": false }
	hero_combat_state.turnReady = false
	return _internal_hero_action(hero, null)

# =========================================================================
# AÇÃO DO HERÓI (Skill)
# =========================================================================
func hero_cast_skill(hero, skill: Dictionary) -> Dictionary:
	if not is_combat_active or hero_combat_state.atb < 100:
		return { "success": false }
	hero_combat_state.turnReady = false
	
	# Validação de Traço
	if HeroTraitsSystem:
		var validation = HeroTraitsSystem.canCast(hero, skill)
		if not validation.allowed:
			return { "success": false, "msg": "⚠️ Bloqueio de Traço: %s" % validation.msg }
	
	# TODO: Implementar dedução de custo de mana/recurso aqui
	# (Traduzir toda a lógica de custos de classes de castCombatSkill)
	
	return _internal_hero_action(hero, skill)

# =========================================================================
# EXECUÇÃO INTERNA DA AÇÃO DO HERÓI
# =========================================================================
func _internal_hero_action(hero, skill_obj) -> Dictionary:
	var calc = hero.recalculate_stats()
	var enemy = active_enemy
	var is_hitting_broken = enemy.staggerBroken
	var result = { "success": true, "damage": 0, "crit": false, "miss": false }
	
	# Fase dos Minions
	_process_minion_phase(hero, calc, enemy)
	if enemy.hp <= 0:
		_finalize_combat_win(hero)
		result["kill"] = true
		return result
	
	# Rolar D20
	var d20 = (randi() % 20) + 1
	
	if d20 == 1:
		emit_signal("combat_log", "💀 D20 = 1: FALHA CRÍTICA ABSOLUTA!", "combat")
		emit_signal("screen_shake")
		combo_counter = 0
		emit_signal("combo_updated", combo_counter, 1.0)
		result["miss"] = true
		_end_hero_turn(hero, calc)
		return result
	
	# Calcular dano bruto
	var raw_dmg = calc.attack
	if skill_obj:
		# Se a skill tiver ratio e stat key, usa fórmula de skill
		if skill_obj.has("ratio") and skill_obj.has("scaleStat"):
			raw_dmg = int(skill_obj.ratio * (hero.attributes.get(skill_obj.scaleStat, 10) * 2.0))
		elif skill_obj.has("baseDmg"):
			raw_dmg = skill_obj.baseDmg
	
	# Calcular dano final
	var final_dmg = _calc_hero_final_dmg(hero, calc, skill_obj, enemy, raw_dmg, d20)
	
	if final_dmg > 0:
		# Combo
		combo_counter += 1
		var combo_mult = _get_combo_multiplier()
		if combo_mult > 1.0:
			final_dmg = int(final_dmg * combo_mult)
		emit_signal("combo_updated", combo_counter, combo_mult)
		
		# Aplicar dano
		enemy.hp -= final_dmg
		enemy.currentHp = enemy.hp
		result["damage"] = final_dmg
		emit_signal("enemy_damaged", final_dmg)
		emit_signal("floating_text", final_dmg, "damage", "enemy")
		
		# Ganho de recursos por classe
		_gain_class_resource(hero, skill_obj)
		
		# Dano de Postura
		if enemy.has("posture") and not is_hitting_broken:
			var stagger_bonus = calc.passives.get("staggerBonus", 0.0)
			var posture_dmg = int(final_dmg + final_dmg * stagger_bonus)
			enemy.posture -= posture_dmg
			if enemy.posture <= 0:
				enemy.posture = 0
				enemy.staggerBroken = true
				enemy.statuses.append({ "type": "stun", "duration": 1 })
				emit_signal("posture_broken", "enemy")
				emit_signal("combat_log", "🛡️💥 POSTURA QUEBRADA! %s atordoado!" % enemy.name, "reward")
				emit_signal("screen_shake")
		
		# Vampirismo
		var life_steal_value = 0.0
		if calc.passives.get("lifeSteal", 0) > 0:
			life_steal_value += final_dmg * calc.passives.lifeSteal
		if life_steal_value > 0:
			var heal_amt = int(life_steal_value)
			hero.current_hp = min(calc.maxHp, hero.current_hp + heal_amt)
			emit_signal("hero_healed", heal_amt)
			emit_signal("floating_text", heal_amt, "heal", "hero")
	else:
		result["miss"] = true
	
	# Post Action Hook
	if HeroTraitsSystem:
		var action_result = { "type": "skill" if skill_obj else "attack", "skillObj": skill_obj }
		var hook_effects = HeroTraitsSystem.postActionHook(hero, active_enemy, action_result)
		for ef in hook_effects:
			if ef and ef.has("damageHero"):
				hero.current_hp = max(0, hero.current_hp - ef.damageHero)
				emit_signal("hero_damaged", ef.damageHero)
			if ef and ef.has("log"):
				emit_signal("combat_log", ef.log, "danger")
		if hero.current_hp <= 0:
			_handle_hero_death(hero)
			result["hero_died"] = true
			return result
	
	# Vitória?
	if enemy.hp <= 0:
		_finalize_combat_win(hero)
		result["kill"] = true
		return result
	
	_end_hero_turn(hero, calc)
	return result

# =========================================================================
# RESOLUÇÃO DO ATAQUE INIMIGO
# =========================================================================
func resolve_enemy_attack(hero, parry_success: bool = false):
	var calc = hero.recalculate_stats()
	
	if parry_success:
		hero_combat_state.atb = 100
		emit_signal("combat_log", "🛡️ ESQUIVA PERFEITA! Turno recuperado!", "reward")
		if active_enemy.has("posture"):
			active_enemy.posture = max(0, active_enemy.posture - 15)
			if active_enemy.posture <= 0:
				active_enemy.staggerBroken = true
				active_enemy.statuses.append({ "type": "stun", "duration": 1 })
				emit_signal("posture_broken", "enemy")
				emit_signal("screen_shake")
	else:
		var action = _execute_monster_ai(active_enemy, hero, calc)
		emit_signal("combat_log", "🧠 %s" % action.log, "combat")
		
		if action.type == "defend":
			active_enemy["aiDefendTurn"] = true
			active_enemy.atb = 0
			return
		
		if action.type == "heal":
			var heal_amt = int(active_enemy.maxHp * 0.15)
			active_enemy.hp = min(active_enemy.maxHp, active_enemy.hp + heal_amt)
			active_enemy.currentHp = active_enemy.hp
			emit_signal("enemy_healed", heal_amt)
			active_enemy.atb = 0
			return
		
		# Calcular dano ao herói
		var enemy_raw_dmg = action.dmg
		
		# Imunidade (Bárbaro)
		if hero_combat_state.get("immuneToDamage", false):
			enemy_raw_dmg = 0
			emit_signal("combat_log", "🛡️ SUA FÚRIA IGNORA A DOR!", "reward")
			hero_combat_state.immuneToDamage = false
		
		var total_def = calc.defense + hero_combat_state.get("defBuff", 0)
		var damage_taken = int(max(1, enemy_raw_dmg * (100.0 / (100.0 + max(0, total_def)))))
		if enemy_raw_dmg == 0: damage_taken = 0
		
		# Modificadores de Traits
		if HeroTraitsSystem:
			var attack_type = action.get("skillType", "Físico")
			damage_taken = HeroTraitsSystem.getTakeDamageMod(hero, attack_type, damage_taken)
		
		# Dano de Postura do Herói (Estamina)
		if hero_combat_state.get("staggerBroken", false):
			damage_taken *= 2
			emit_signal("combat_log", "⚠️ GOLPE FULMINANTE! Sem guarda, dano dobrado!", "danger")
			hero_combat_state.staggerBroken = false
		
		# Sistema de Sanidade
		_process_sanity_system(hero)
		
		# Minion Shield
		damage_taken = _process_minion_shield(hero, damage_taken)
		
		# Aplicar dano
		if damage_taken > 0:
			hero.current_hp -= damage_taken
			
			# Último Suspiro (Bárbaro)
			if hero.current_hp <= 0 and hero.hero_class in ["Bárbaro", "Barbaro"] and not hero_combat_state.get("barbarianLastStandUsed", false):
				hero.current_hp = 1
				hero_combat_state.barbarianLastStandUsed = true
				hero_combat_state.atkBuff = hero_combat_state.get("atkBuff", 0) + 100
				hero_combat_state.immuneToDamage = true
				emit_signal("combat_log", "🩸 ÚLTIMO SUSPIRO! HP cravado em 1, imunidade e +100% ATK!", "reward")
				emit_signal("screen_shake")
			
			# Estamina
			if hero.get("stamina", 100) > 0:
				hero.stamina = max(0, hero.stamina - int(damage_taken * 0.2))
				if hero.stamina <= 0:
					hero_combat_state.staggerBroken = true
					emit_signal("combat_log", "🛡️💥 SUA GUARDA FOI QUEBRADA!", "danger")
					emit_signal("screen_shake")
			
			emit_signal("hero_damaged", damage_taken)
			emit_signal("floating_text", damage_taken, "damage", "hero")
			emit_signal("combat_log", "🩸 Você sofreu %d de DANO!" % damage_taken, "combat")
			emit_signal("screen_shake")
		
		# Ganho de recurso ao apanhar
		if hero.hero_class == "Guerreiro":
			hero["furia"] = min(100, hero.get("furia", 0) + 10)
		elif hero.hero_class in ["Bárbaro", "Barbaro"]:
			hero["adrenalina"] = min(100, hero.get("adrenalina", 0) + 10)
	
	active_enemy.atb = 0
	
	if hero.current_hp <= 0:
		_handle_hero_death(hero)

# =========================================================================
# CÁLCULO FINAL DE DANO DO HERÓI
# =========================================================================
func _calc_hero_final_dmg(hero, calc: Dictionary, skill_obj, enemy: Dictionary, raw_dmg: int, d20: int) -> int:
	var final_dmg = float(raw_dmg)
	
	# Buff de ataque
	if hero_combat_state.get("atkBuff", 0) != 0:
		final_dmg = max(1, final_dmg * (1.0 + hero_combat_state.atkBuff / 100.0))
	
	# Traits
	if HeroTraitsSystem:
		final_dmg = HeroTraitsSystem.getDamageMod(hero, enemy, skill_obj if skill_obj else {}, final_dmg)
	
	# Exaustão
	var is_exhausted = hero.get("stamina", 100) <= 0
	
	# Crítico
	var crit_chance = calc.passives.get("critChance", 0.05)
	if HeroTraitsSystem:
		crit_chance = HeroTraitsSystem.getCritChanceMod(hero, crit_chance * 100) / 100.0
	
	if not is_exhausted and (randf() < crit_chance or d20 == 20 or hero_combat_state.get("rangerHeadshot", false)) and final_dmg > 0:
		final_dmg *= calc.passives.get("critDamage", 1.5)
		if d20 == 20:
			final_dmg *= 1.5
		emit_signal("combat_log", "💥 ACERTO CRÍTICO LETAL!", "reward")
		emit_signal("screen_shake")
	
	if is_exhausted and final_dmg > 0:
		final_dmg = final_dmg * 0.5
	
	# Precisão / Esquiva
	var hero_accuracy = 0.95 + hero.attributes.get("agilidade", 10) * 0.002
	if HeroTraitsSystem:
		hero_accuracy = HeroTraitsSystem.getHitChanceMod(hero, skill_obj if skill_obj else {}, hero_accuracy * 100) / 100.0
	
	# Esquiva do monstro
	var enemy_evasion = 0.0
	if enemy.has("tags") and typeof(enemy.tags) == TYPE_DICTIONARY and enemy.tags.has("dodgeChance"):
		enemy_evasion += enemy.tags.dodgeChance
	if enemy.get("affixes", []).has("agile"):
		enemy_evasion += 0.3
	
	var hit_chance = clamp(hero_accuracy - enemy_evasion, 0.05, 1.0)
	
	if not enemy.staggerBroken and not hero_combat_state.get("rangerHeadshot", false) and randf() > hit_chance and (not skill_obj or not skill_obj.has("type")):
		emit_signal("combat_log", "💨 MISS! O ataque falhou!", "status")
		emit_signal("floating_text", "MISS", "block", "enemy")
		return 0
	
	if final_dmg > 0:
		# Penetração de armadura
		var armor_pen = calc.passives.get("ignoreDef", 0.0)
		if hero_combat_state.get("rangerHeadshot", false):
			armor_pen = 1.0
			hero_combat_state.rangerHeadshot = false
		
		# Blindado
		if enemy.get("affixes", []).has("armored") and (not skill_obj or not skill_obj.has("type")):
			final_dmg *= 0.6
		
		# Defesa do inimigo (AAA de retornos decrescentes)
		if enemy.get("aiDefendTurn", false):
			final_dmg *= 0.3
			enemy.aiDefendTurn = false
		
		# Bônus massivo no stagger
		if enemy.staggerBroken:
			final_dmg *= 2.5
			emit_signal("combat_log", "💥 GOLPE DE MISERICÓRDIA! DANO MASSIVO!", "reward")
		
		# Variância ±10%
		final_dmg *= (0.9 + randf() * 0.2)
		
		# Fórmula AAA
		var effective_def = int(enemy.get("def", 0) * max(0, 1.0 - armor_pen))
		final_dmg = max(1, final_dmg * (float(DEFENSE_CONSTANT) / float(DEFENSE_CONSTANT + effective_def)))
	
	return int(final_dmg)

# =========================================================================
# IA DOS MONSTROS
# =========================================================================
func _execute_monster_ai(enemy: Dictionary, hero, calc: Dictionary) -> Dictionary:
	if not enemy.has("cooldowns"): enemy["cooldowns"] = {}
	if not enemy.has("turnCounter"): enemy["turnCounter"] = 0
	enemy.turnCounter += 1
	
	# Decrementar cooldowns
	for sk_id in enemy.cooldowns:
		if enemy.cooldowns[sk_id] > 0: enemy.cooldowns[sk_id] -= 1
	
	var hp_percent = float(enemy.currentHp) / float(enemy.maxHp)
	var base_dmg = int(enemy.atk * (0.9 + randf() * 0.2))
	
	# IA simples baseada no tipo
	match enemy.get("aiType", "balanced"):
		"aggressive":
			if randf() < 0.2:
				return { "type": "heavy_attack", "dmg": int(base_dmg * 1.5), "log": "%s desfere um golpe brutal!" % enemy.name }
			return { "type": "attack", "dmg": base_dmg, "log": "%s ataca ferozmente!" % enemy.name }
		"defensive":
			if hp_percent < 0.3 and randf() < 0.4:
				return { "type": "heal", "dmg": 0, "log": "%s se regenera nas sombras!" % enemy.name }
			if randf() < 0.3:
				return { "type": "defend", "dmg": 0, "log": "%s assume postura defensiva!" % enemy.name }
			return { "type": "attack", "dmg": base_dmg, "log": "%s contra-ataca!" % enemy.name }
		"caster":
			if randf() < 0.3:
				return { "type": "debuff", "dmg": int(base_dmg * 0.8), "skillType": "Arcano", "log": "%s conjura uma magia sombria!" % enemy.name }
			return { "type": "attack", "dmg": int(base_dmg * 0.9), "skillType": "Arcano", "log": "%s dispara um projétil arcano!" % enemy.name }
		_: # balanced
			var roll = randf()
			if roll < 0.15 and hp_percent < 0.4:
				return { "type": "heal", "dmg": 0, "log": "%s tenta se curar!" % enemy.name }
			elif roll < 0.25:
				return { "type": "defend", "dmg": 0, "log": "%s ergue sua guarda!" % enemy.name }
			else:
				return { "type": "attack", "dmg": base_dmg, "log": "%s ataca!" % enemy.name }

# =========================================================================
# HELPERS INTERNOS
# =========================================================================

func _process_minion_phase(hero, calc: Dictionary, enemy: Dictionary):
	var minions = hero_combat_state.get("activeMinions", [])
	if minions.is_empty(): return
	
	var total_dmg = 0
	for minion in minions:
		var dmg = int((hero.level * 1.5 + hero.attributes.get("inteligencia", 10) * 0.5 + 5) * minion.get("dmgMult", 1.0))
		total_dmg += dmg
	
	enemy.hp -= total_dmg
	enemy.currentHp = enemy.hp
	emit_signal("enemy_damaged", total_dmg)
	emit_signal("combat_log", "💀 A Tropa de Ossos ataca! (Total: %d Dano)" % total_dmg, "combat")

func _process_minion_shield(hero, damage: int) -> int:
	var minions = hero_combat_state.get("activeMinions", [])
	if minions.is_empty(): return damage
	
	var remaining = damage
	while minions.size() > 0 and remaining > 0:
		var minion = minions[0]
		if minion.hp >= remaining:
			minion.hp -= remaining
			emit_signal("combat_log", "🛡️ %s absorveu %d de dano!" % [minion.name, remaining], "normal")
			remaining = 0
		else:
			remaining -= minion.hp
			minions.pop_front()
			emit_signal("combat_log", "💀 Escudo Quebrado! Minion destruído!", "combat")
	return remaining

func _get_combo_multiplier() -> float:
	if combo_counter < 3: return 1.0
	elif combo_counter < 5: return 1.15
	elif combo_counter < 8: return 1.3
	elif combo_counter < 12: return 1.5
	else: return 2.0

func _gain_class_resource(hero, skill_obj):
	if hero.hero_class == "Guerreiro":
		hero["furia"] = min(100, hero.get("furia", 0) + 15)
	elif hero.hero_class == "Ranger":
		if not skill_obj or skill_obj.get("cost", 0) == 0:
			hero["foco"] = min(100, hero.get("foco", 100) + 10)
	elif hero.hero_class in ["Necromante", "Arcanista"]:
		hero["almas"] = min(100, hero.get("almas", 0) + 5)
	elif hero.hero_class == "Paladino":
		hero["fe"] = min(100, hero.get("fe", 0) + 10)

func _process_sanity_system(hero):
	var is_formidable = active_enemy.get("lvl", 0) >= 5 or active_enemy.get("isBoss", false) or active_enemy.get("isElite", false)
	if not is_formidable: return
	if hero_combat_state.get("determinationTested", false): return
	
	hero["sanity"] = max(0, hero.get("sanity", 100) - ((randi() % 8) + 4))
	
	if hero.get("sanity", 100) > 0: return
	
	# Intervenção Divina (Paladino)
	if hero.hero_class == "Paladino" and hero.get("fe", 0) >= 100:
		hero["fe"] = 0
		hero["sanity"] = hero.get("max_sanity", 100)
		emit_signal("sanity_event", "divine", "☀️ A LUZ PREVALECE! Fé purificou as trevas!")
		return
	
	# Transferência de Loucura (Necromante)
	var minions = hero_combat_state.get("activeMinions", [])
	if hero.hero_class == "Necromante" and minions.size() > 0:
		minions.pop_front()
		hero["sanity"] = hero.get("max_sanity", 100)
		emit_signal("sanity_event", "transfer", "💀 LOUCURA TRANSFERIDA para um minion!")
		return
	
	# Teste de Determinação
	hero_combat_state.determinationTested = true
	if randf() < 0.35:
		emit_signal("sanity_event", "virtue", "🌟 VIRTUDE! Força no desespero!")
		hero_combat_state.atkBuff = hero_combat_state.get("atkBuff", 0) + 50
		hero_combat_state.defBuff = hero_combat_state.get("defBuff", 0) + 50
		hero["sanity"] = hero.get("max_sanity", 100)
	else:
		emit_signal("sanity_event", "affliction", "💀 AFLIÇÃO! A loucura tomou conta!")
		hero_combat_state.atkBuff = hero_combat_state.get("atkBuff", 0) - 30
		hero_combat_state.defBuff = hero_combat_state.get("defBuff", 0) - 30
	emit_signal("screen_shake")

func _process_status_array(statuses: Array, name: String) -> Dictionary:
	var result = { "dmg": 0, "skip": false }
	var to_remove = []
	
	for i in range(statuses.size()):
		var st = statuses[i]
		match st.type:
			"poison":
				result.dmg += st.get("power", 5)
				emit_signal("combat_log", "☠️ %s sofre %d de Veneno!" % [name, st.get("power", 5)], "status")
			"burn":
				result.dmg += st.get("power", 10)
				emit_signal("combat_log", "🔥 %s queima por %d!" % [name, st.get("power", 10)], "status")
			"bleed":
				result.dmg += st.get("power", 8)
				emit_signal("combat_log", "🩸 %s sangra por %d!" % [name, st.get("power", 8)], "status")
			"stun":
				result.skip = true
				emit_signal("combat_log", "⚡ %s está atordoado!" % name, "status")
			"freeze":
				result.skip = true
				emit_signal("combat_log", "❄️ %s está congelado!" % name, "status")
		
		st.duration -= 1
		if st.duration <= 0:
			to_remove.append(i)
	
	# Remover expirados (de trás pra frente)
	to_remove.reverse()
	for idx in to_remove:
		statuses.remove_at(idx)
	
	return result

func _process_hero_status_array(hero, statuses: Array) -> Dictionary:
	return _process_status_array(statuses, hero.hero_name)

func _end_hero_turn(hero, calc: Dictionary):
	hero_combat_state.atb = 0
	if hero_combat_state.get("orcCooldown", 0) > 0: hero_combat_state.orcCooldown -= 1
	
	# Desgaste de equipamento (35% de chance por turno)
	for slot_key in hero.equipment:
		var item = hero.equipment[slot_key]
		if item and item.has("durability") and randf() < 0.35:
			item.durability = max(0, item.durability - 1)
			if item.durability <= 0:
				hero.equipment[slot_key] = null
				emit_signal("combat_log", "⚠️ [%s] estilhaçou-se no combate!" % item.name, "combat")

func _finalize_combat_win(hero):
	is_combat_active = false
	
	var xp_reward = active_enemy.get("xpDrop", int(active_enemy.get("maxHp", 100) * 1.5))
	var gold_reward = active_enemy.get("goldDrop", int(active_enemy.get("maxHp", 100) * 0.5))
	
	if active_enemy.get("isBoss", false):
		xp_reward = int(xp_reward * 2.5)
		gold_reward = int(gold_reward * 2)
	if active_enemy.get("isElite", false):
		xp_reward = int(xp_reward * 1.5)
		gold_reward = int(gold_reward * 1.5)
	
	hero.gold += gold_reward
	hero.gain_xp(xp_reward)
	
	# Gerar Loot
	var loot = []
	if LootEngine:
		var loot_count = 1
		if active_enemy.get("isBoss", false): loot_count = 3
		elif active_enemy.get("isElite", false): loot_count = 2
		loot = LootEngine.generate_loot_drop(hero.get("dungeonLevel", 1), loot_count, active_enemy)
		for item in loot:
			hero.inventory.append(item)
	
	# Bestiário
	if not hero.has("bestiary"): hero["bestiary"] = {}
	var base_name = active_enemy.get("baseName", active_enemy.name)
	hero.bestiary[base_name] = hero.bestiary.get(base_name, 0) + 1
	
	# Stats
	hero.stats.kills += 1
	if active_enemy.get("isBoss", false): hero.stats.bossKills += 1
	
	emit_signal("combat_log", "🏆 Vitória contra %s! (+%d XP, +%d Ouro)" % [active_enemy.name, xp_reward, gold_reward], "reward")
	emit_signal("combat_won", xp_reward, gold_reward, loot)

func _handle_hero_death(hero):
	is_combat_active = false
	hero.stats.deaths += 1
	emit_signal("combat_log", "💀 Você tombou nas trevas do Santuário...", "danger")
	emit_signal("hero_died")
