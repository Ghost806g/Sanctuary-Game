extends Node

# =========================================================================
# SISTEMA DE TRAÇOS DO HERÓI (RAÇAS, CLASSES E PROFISSÕES)
# =========================================================================

# Helpers
func hasEnemyTag(enemy, tag: String) -> bool:
	if not enemy or not enemy.has("name"):
		return false
	var n = enemy.name.to_lower()
	if tag == "morto-vivo":
		return "esqueleto" in n or "zumbi" in n or "morte" in n or "coveiro" in n or "carniça" in n
	if tag == "demonio":
		return "demônio" in n or "diabólico" in n or "infernal" in n or "súcubo" in n
	if enemy.has("tags"):
		if typeof(enemy.tags) == TYPE_ARRAY and tag in enemy.tags:
			return true
		if typeof(enemy.tags) == TYPE_DICTIONARY and enemy.tags.has("types") and typeof(enemy.tags.types) == TYPE_ARRAY and tag in enemy.tags.types:
			return true
	return false

# --- RAÇAS ---
var Races = {
	"Humanos": {},
	"Elfos": {
		"evasionMod": func(baseEv): return baseEv + 15,
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.15 if type == "Físico" else baseDmg
	},
	"Anões": {
		"defenseMod": func(baseDef): return baseDef * 1.25,
		"takeDamageMod": func(baseDmg, type): return baseDmg * 0.70 if type == "Fogo" else baseDmg
	},
	"Orcs": {
		"canCast": func(skill): return skill.type != "Arcano",
		"castErrorMsg": "Orcs não possuem intelecto para magias Arcanas complexas."
	}
}

# --- CLASSES BASE ---
var Classes = {
	"Guerreiro": {},
	"Paladino": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 1.3 if hasEnemyTag(enemy, "morto-vivo") or hasEnemyTag(enemy, "demonio") else baseDmg
	},
	"Ranger": {},
	"Necromante": {
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.5 if type == "Luz" else baseDmg
	},
	"Arcanista": {},
	"Bárbaro": {}
}

# --- PROFISSÕES ---
var Professions = {
	# GUERREIRO
	"Ferreiro de Guerra": {},
	"Mercenário": {
		"critChanceMod": func(baseCrit): return baseCrit + 15,
		"healReceivedMod": func(baseHeal): return baseHeal * 0.5
	},
	"Mestre das Armas": {
		"critChanceMod": func(baseCrit): return baseCrit + 10
	},
	"Vanguarda Sangrenta": {
		"evasionMod": func(baseEv): return 0
	},
	"Cavaleiro Caído": {},

	# PALADINO
	"Inquisidor do Sol": {
		"canCast": func(skill): return skill.type != "Cura" and skill.type != "Suporte",
		"castErrorMsg": "Sua profissão abomina suporte. Purifique-os com o fogo e o aço!",
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 1.3 if skill.type == "Luz" else baseDmg
	},
	"Clérigo de Batalha": {
		"healMod": func(baseHeal): return baseHeal * 2.0,
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 0.5
	},
	"Guardião do Juramento": {
		"critChanceMod": func(baseCrit): return 0,
		"defenseMod": func(baseDef): return baseDef * 1.4
	},
	"Templário de Prata": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 1.6 if hasEnemyTag(enemy, "morto-vivo") else baseDmg
	},
	"Exorcista Cego": {
		"hitChanceMod": func(baseHit, skill): return baseHit - 25 if skill.type == "Físico" else baseHit
	},

	# ARCANISTA
	"Erudito do Vazio": {
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.15
	},
	"Alquimista Louco": {
		"healReceivedMod": func(baseHeal): return baseHeal * 2.0,
		"postActionHook": func(hero, enemy, actionResult):
			if actionResult.type == "skill" and randf() < 0.15:
				var backlash = int(hero.maxHp * 0.1)
				return [{ "log": "💥 MISTURA INSTÁVEL! A magia explodiu na sua cara!", "damageHero": backlash }]
			return []
	},
	"Tecelão do Caos": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * (0.5 + randf() * 1.5) if skill.type != "Físico" else baseDmg,
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.5 if type != "Físico" else baseDmg
	},
	"Arquivista da Ruína": {
		"critChanceMod": func(baseCrit): return baseCrit + 20
	},
	"Invocador de Cinzas": {
		"takeDamageMod": func(baseDmg, type): return baseDmg * 0.2 if type == "Fogo" else baseDmg,
		"canCast": func(skill): return skill.type != "Gelo" and skill.type != "Cura",
		"castErrorMsg": "Invocadores de Cinzas não podem usar magias de Gelo ou Cura."
	},

	# RANGER
	"Caçador de Cabeças": {
		"defenseMod": func(baseDef): return baseDef * 0.8
	},
	"Batedor das Sombras": {
		"evasionMod": func(baseEv): return baseEv + 30,
		"equipStatsMod": func(item, atk, def, hero=null):
			var n = item.name.to_lower() if item.has("name") else ""
			if "placa" in n or "pesad" in n or item.get("type") == "shield":
				return { "atk": 0, "def": 0 }
			return { "atk": atk, "def": def },
		"defenseMod": func(baseDef): return baseDef * 0.5
	},
	"Mestre das Feras": {
		"canCast": func(skill): return skill.type != "Arcano" and skill.type != "Profano",
		"castErrorMsg": "Sua inteligência é animalesca demais para magias complexas."
	},
	"Franco-Atirador Arcano": {},
	"Sobrevivente do Ermo": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 0.5 if skill.type == "Físico" else baseDmg,
		"applyStatusMod": func(effectObj, hero=null):
			var res = effectObj.duplicate(true)
			if res.type == "poison" or res.type == "bleed":
				res.duration += 2
				if res.has("power"): res.power = int(res.power * 1.5)
				if res.has("chance"): res.chance += 0.3
			return res
	},

	# BARBARO
	"Executor Bestial": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 1.3,
		"evasionMod": func(baseEv): return 0
	},
	"Devorador de Carniças": {
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.5 if type == "Luz" else baseDmg
	},
	"Gladiador Esquecido": {
		"evasionMod": func(baseEv): return baseEv + 15,
		"defenseMod": func(baseDef): return baseDef * 0.7
	},
	"Xamã de Sangue": {
		"damageMod": func(baseDmg, enemy, skill, hero): return baseDmg * 1.5 if hero and hero.currentHp < hero.maxHp * 0.5 else baseDmg,
		"healReceivedMod": func(baseHeal): return baseHeal * 0.5
	},
	"Quebrador de Crânios": {
		"hitChanceMod": func(baseHit, skill): return baseHit - 30
	},

	# NECROMANTE
	"Mestre de Ossos": {
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.3 if type == "Fogo" or type == "Físico" else baseDmg
	},
	"Sacerdote da Morte": {
		"healMod": func(baseHeal): return baseHeal * 2.0,
		"canCast": func(skill): return skill.type != "Físico",
		"castErrorMsg": "Sacerdotes da Morte não se rebaixam a ataques físicos diretos."
	},
	"Colhedor de Almas": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 3.0 if enemy and enemy.currentHp < enemy.maxHp * 0.2 else baseDmg,
		"postActionHook": func(hero, enemy, actionResult):
			if actionResult.type == "skill" and enemy and enemy.currentHp > 0:
				var backlash = int(hero.maxHp * 0.05)
				return { "log": "🖤 A Morte exige seu dízimo!", "damageHero": backlash }
			return null
	},
	"Coveiro Maldito": {
		"critChanceMod": func(baseCrit): return 0,
		"applyStatusMod": func(effectObj, hero=null):
			var res = effectObj.duplicate(true)
			if res.type == "poison":
				res.duration += 3
				if res.has("power"): res.power = int(res.power * 2.0)
			return res
	},
	"Ocultista Sombrio": {
		"damageMod": func(baseDmg, enemy, skill, hero=null): return baseDmg * 2.0 if skill.type == "Profano" else baseDmg,
		"takeDamageMod": func(baseDmg, type): return baseDmg * 1.2
	}
}

# --- FUNÇÕES DE RESOLUÇÃO (HOOKS) ---
func canCast(hero, skill) -> Dictionary:
	if Races.has(hero.race) and Races[hero.race].has("canCast"):
		if not Races[hero.race].canCast.call(skill):
			return { "allowed": false, "msg": Races[hero.race].get("castErrorMsg", "Sua Raça não permite essa ação.") }
	if Classes.has(hero.class) and Classes[hero.class].has("canCast"):
		if not Classes[hero.class].canCast.call(skill):
			return { "allowed": false, "msg": Classes[hero.class].get("castErrorMsg", "Sua Classe não permite essa ação.") }
	if Professions.has(hero.profession) and Professions[hero.profession].has("canCast"):
		if not Professions[hero.profession].canCast.call(skill):
			return { "allowed": false, "msg": Professions[hero.profession].get("castErrorMsg", "Sua Profissão não permite essa ação.") }
	return { "allowed": true }

func getDamageMod(hero, enemy, skill, baseDmg):
	var finalDmg = baseDmg
	if Races.has(hero.race) and Races[hero.race].has("damageMod"): finalDmg = Races[hero.race].damageMod.call(finalDmg, enemy, skill, hero)
	if Classes.has(hero.class) and Classes[hero.class].has("damageMod"): finalDmg = Classes[hero.class].damageMod.call(finalDmg, enemy, skill, hero)
	if Professions.has(hero.profession) and Professions[hero.profession].has("damageMod"): finalDmg = Professions[hero.profession].damageMod.call(finalDmg, enemy, skill, hero)
	return finalDmg

func getHealMod(hero, baseHeal):
	var finalHeal = baseHeal
	if Races.has(hero.race) and Races[hero.race].has("healMod"): finalHeal = Races[hero.race].healMod.call(finalHeal)
	if Classes.has(hero.class) and Classes[hero.class].has("healMod"): finalHeal = Classes[hero.class].healMod.call(finalHeal)
	if Professions.has(hero.profession) and Professions[hero.profession].has("healMod"): finalHeal = Professions[hero.profession].healMod.call(finalHeal)
	return finalHeal

func getEquipStatsMod(hero, item, atk, def):
	var res = { "atk": atk, "def": def }
	if Races.has(hero.race) and Races[hero.race].has("equipStatsMod"): res = Races[hero.race].equipStatsMod.call(item, res.atk, res.def, hero)
	if Classes.has(hero.class) and Classes[hero.class].has("equipStatsMod"): res = Classes[hero.class].equipStatsMod.call(item, res.atk, res.def, hero)
	if Professions.has(hero.profession) and Professions[hero.profession].has("equipStatsMod"): res = Professions[hero.profession].equipStatsMod.call(item, res.atk, res.def, hero)
	return res

func getHealReceivedMod(hero, baseHeal):
	var finalHeal = baseHeal
	if Races.has(hero.race) and Races[hero.race].has("healReceivedMod"): finalHeal = Races[hero.race].healReceivedMod.call(finalHeal)
	if Classes.has(hero.class) and Classes[hero.class].has("healReceivedMod"): finalHeal = Classes[hero.class].healReceivedMod.call(finalHeal)
	if Professions.has(hero.profession) and Professions[hero.profession].has("healReceivedMod"): finalHeal = Professions[hero.profession].healReceivedMod.call(finalHeal)
	return finalHeal

func getApplyStatusMod(hero, effectObj):
	var res = effectObj.duplicate(true)
	if Races.has(hero.race) and Races[hero.race].has("applyStatusMod"): res = Races[hero.race].applyStatusMod.call(res, hero)
	if Classes.has(hero.class) and Classes[hero.class].has("applyStatusMod"): res = Classes[hero.class].applyStatusMod.call(res, hero)
	if Professions.has(hero.profession) and Professions[hero.profession].has("applyStatusMod"): res = Professions[hero.profession].applyStatusMod.call(res, hero)
	return res

func getDefenseMod(hero, baseDef):
	var finalDef = baseDef
	if Races.has(hero.race) and Races[hero.race].has("defenseMod"): finalDef = Races[hero.race].defenseMod.call(finalDef)
	if Classes.has(hero.class) and Classes[hero.class].has("defenseMod"): finalDef = Classes[hero.class].defenseMod.call(finalDef)
	if Professions.has(hero.profession) and Professions[hero.profession].has("defenseMod"): finalDef = Professions[hero.profession].defenseMod.call(finalDef)
	return finalDef

func postActionHook(hero, enemy, actionResult) -> Array:
	var effects = []
	if Races.has(hero.race) and Races[hero.race].has("postActionHook"):
		var res = Races[hero.race].postActionHook.call(hero, enemy, actionResult)
		if res != null: effects.append(res)
	if Classes.has(hero.class) and Classes[hero.class].has("postActionHook"):
		var res = Classes[hero.class].postActionHook.call(hero, enemy, actionResult)
		if res != null: effects.append(res)
	if Professions.has(hero.profession) and Professions[hero.profession].has("postActionHook"):
		var res = Professions[hero.profession].postActionHook.call(hero, enemy, actionResult)
		if res != null: effects.append(res)
	return effects

func getEvasionMod(hero, baseEv):
	var finalEv = baseEv
	if Races.has(hero.race) and Races[hero.race].has("evasionMod"): finalEv = Races[hero.race].evasionMod.call(finalEv)
	if Classes.has(hero.class) and Classes[hero.class].has("evasionMod"): finalEv = Classes[hero.class].evasionMod.call(finalEv)
	if Professions.has(hero.profession) and Professions[hero.profession].has("evasionMod"): finalEv = Professions[hero.profession].evasionMod.call(finalEv)
	return finalEv

func getCritChanceMod(hero, baseCrit):
	var finalCrit = baseCrit
	if Races.has(hero.race) and Races[hero.race].has("critChanceMod"): finalCrit = Races[hero.race].critChanceMod.call(finalCrit)
	if Classes.has(hero.class) and Classes[hero.class].has("critChanceMod"): finalCrit = Classes[hero.class].critChanceMod.call(finalCrit)
	if Professions.has(hero.profession) and Professions[hero.profession].has("critChanceMod"): finalCrit = Professions[hero.profession].critChanceMod.call(finalCrit)
	return finalCrit

func getHitChanceMod(hero, skill, baseHit):
	var finalHit = baseHit
	if Races.has(hero.race) and Races[hero.race].has("hitChanceMod"): finalHit = Races[hero.race].hitChanceMod.call(finalHit, skill)
	if Classes.has(hero.class) and Classes[hero.class].has("hitChanceMod"): finalHit = Classes[hero.class].hitChanceMod.call(finalHit, skill)
	if Professions.has(hero.profession) and Professions[hero.profession].has("hitChanceMod"): finalHit = Professions[hero.profession].hitChanceMod.call(finalHit, skill)
	return finalHit

func getTakeDamageMod(hero, type, baseDmg):
	var finalDmg = baseDmg
	if Races.has(hero.race) and Races[hero.race].has("takeDamageMod"): finalDmg = Races[hero.race].takeDamageMod.call(finalDmg, type)
	if Classes.has(hero.class) and Classes[hero.class].has("takeDamageMod"): finalDmg = Classes[hero.class].takeDamageMod.call(finalDmg, type)
	if Professions.has(hero.profession) and Professions[hero.profession].has("takeDamageMod"): finalDmg = Professions[hero.profession].takeDamageMod.call(finalDmg, type)
	return finalDmg
