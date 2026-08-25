extends Node
class_name Hero

# === Atributos Base ===
var hero_name: String = "Arnolong"
var level: int = 1
var xp: int = 0
var max_xp: int = 100
var stat_points: int = 0
var skill_points: int = 0

var current_hp: int = 100
var max_hp: int = 100
var current_mp: int = 50
var max_mp: int = 50
var current_stamina: int = 100
var max_stamina: int = 100

var sanity: int = 100
var max_sanity: int = 100

var gold: int = 0
var souls: int = 0

var race: String = "Humanos"
var hero_class: String = "Guerreiro" # 'class' is reserved in GDScript
var profession: String = "Ferreiro de Guerra"

var attributes = {
	"forca": 10,
	"agilidade": 10,
	"inteligencia": 10,
	"constituicao": 10,
	"sabedoria": 10
}

var stats = {
	"kills": 0,
	"bossKills": 0,
	"deaths": 0,
	"retreats": 0,
	"mines": 0,
	"forges": 0
}

var inventory: Array = []
var equipment = {
	"weapon": null,
	"armor": null,
	"helmet": null,
	"boots": null,
	"amulet": null,
	"ring1": null,
	"ring2": null
}
var pantheon = {}
var necromancy_book = null
var current_statuses: Array = []

signal leveled_up(new_level: int)
signal stats_changed()

func _init(n: String = "Heroi"):
	hero_name = n
	recalculate_stats()
	current_hp = max_hp
	current_mp = max_mp
	current_stamina = max_stamina

# === Sistema de Experiência ===
func gain_xp(amount: int):
	xp += amount
	var leveled = false
	while xp >= max_xp:
		xp -= max_xp
		level += 1
		stat_points += 3
		skill_points += 2
		max_xp = int(max_xp * 1.65)
		leveled = true
	
	if leveled:
		recalculate_stats()
		emit_signal("leveled_up", level)
	
	emit_signal("stats_changed")

# === Cálculo de Status (computeLiveStats) ===
func recalculate_stats() -> Dictionary:
	var passives = {
		"critChance": 0.05,
		"critDamage": 1.5,
		"lifeSteal": 0.0,
		"ignoreDef": 0.0,
		"reflectDmg": 0.0,
		"damageReduction": 0.0,
		"magicResist": 0.0,
		"defMult": 0.0,
		"bestiaryDmg": 0.0,
		"poisonChance": 0.0,
		"shockChance": 0.0,
		"evasion": 0.0,
		"staggerBonus": 0.0,
		"freezeChance": 0.0,
		"burnPower": 0,
		"burnDuration": 0,
		"statusResist": 0.0,
		"healPower": 1.0,
		"thorns": 0
	}
	
	# TODO: Integrar equipamentos e relíquias aqui (por enquanto zero)
	var gear_atk = 0
	var gear_def = 0
	var relic_hp = 0
	var relic_mp = 0
	var relic_atk = 0
	var relic_def = 0
	var pantheon_dmg_mult = 0.0
	var pantheon_def_mult = 0.0
	var pantheon_max_mp = 0

	var lvl_scale = int(level / 3)
	if hero_class == "Guerreiro": passives.damageReduction += 0.05 + (lvl_scale * 0.01)
	elif hero_class == "Ranger": passives.evasion += 0.10 + (lvl_scale * 0.01)
	elif hero_class == "Arcanista": passives.ignoreDef += 0.15 + (lvl_scale * 0.015)
	elif hero_class == "Necromante": passives.lifeSteal += 0.10 + (lvl_scale * 0.01)
	elif hero_class == "Paladino": 
		passives.statusResist += 0.10 + (lvl_scale * 0.02)
		passives.healPower += (lvl_scale * 0.02)
		
	var barb_dmg_mult = 1.0
	if hero_class == "Bárbaro" or hero_class == "Barbaro":
		var calc_max = int(attributes.constituicao * 15 + 50 + relic_hp)
		var missing_hp_percent = 1.0 - (float(current_hp) / float(calc_max))
		if missing_hp_percent < 0: missing_hp_percent = 0
		var bonus_stacks = int(missing_hp_percent / 0.05)
		passives.critChance += bonus_stacks * 0.01
		barb_dmg_mult = 1.0 + (bonus_stacks * 0.01)
		
	var raw_attack_scaling = 0.0
	var level_mult = sqrt(level if level > 0 else 1)
	
	if hero_class == "Guerreiro": raw_attack_scaling = (attributes.forca * 1.2) * level_mult
	elif hero_class == "Bárbaro" or hero_class == "Barbaro": raw_attack_scaling = (attributes.forca * 1.2) * level_mult * barb_dmg_mult
	elif hero_class == "Arcanista" or hero_class == "Necromante": raw_attack_scaling = (attributes.inteligencia * 1.2) * level_mult
	elif hero_class == "Ranger": raw_attack_scaling = (attributes.agilidade * 1.2) * level_mult
	else: raw_attack_scaling = (attributes.sabedoria * 1.2) * level_mult
		
	var necro_sac_atk = 0
	var necro_sac_mp = 0
	var necro_sac_def = 0
	
	var final_def = (attributes.constituicao * 0.5 + gear_def + relic_def + necro_sac_def) * (1.0 + pantheon_def_mult)
	
	if HeroTraitsSystem:
		final_def = HeroTraitsSystem.getDefenseMod(self, final_def)
		var trait_ev = HeroTraitsSystem.getEvasionMod(self, passives.evasion * 100)
		passives.evasion = trait_ev / 100.0
		passives.critChance = HeroTraitsSystem.getCritChanceMod(self, passives.critChance * 100) / 100.0
	
	max_hp = int(attributes.constituicao * 15 + 50 + relic_hp)
	max_mp = int(attributes.inteligencia * 10 + 20 + pantheon_max_mp + relic_mp + necro_sac_mp)
	max_stamina = int(100 + attributes.constituicao * 3)
	
	var final_atk = int((raw_attack_scaling + gear_atk + relic_atk + necro_sac_atk) * (1.0 + pantheon_dmg_mult))
	
	return {
		"maxHp": max_hp,
		"maxMp": max_mp,
		"maxStamina": max_stamina,
		"attack": final_atk,
		"defense": int(final_def),
		"passives": passives
	}
