extends Node2D

@export var enemy_name: String = "Caustic Slime"
@export var enemy_max_hp: int = 1600
var enemy_hp: int

@export var hero_atk: int = 200

# Nós da Interface (você vai conectar no editor)
@onready var log_label: Label = $LogLabel
@onready var enemy_hp_label: Label = $EnemyHPLabel
@onready var attack_button: Button = $AttackButton

func _ready():
	enemy_hp = enemy_max_hp
	
	# MÁGICA: Vamos carregar a Lâmina Enferrujada que você criou visualmente e equipar no herói!
	var minha_espada = load("res://Lamina_Enferrujada.tres")
	if minha_espada:
		InventoryManager.equip_item(minha_espada, "arma")
		
	update_ui()
	log_label.text = "Um " + enemy_name + " selvagem aparece!"
	
	# Conecta o clique do botão
	attack_button.pressed.connect(_on_attack_pressed)

func _on_attack_pressed():
	if enemy_hp <= 0:
		return
		
	# Cálculo de Dano com a Arma Equipada!
	var raw_dmg = hero_atk
	var weapon_name = "Punhos"
	
	if InventoryManager.equipment["arma"] != null:
		var arma = InventoryManager.equipment["arma"]
		raw_dmg += arma.damage
		weapon_name = arma.name
		
	var d20 = randi() % 20 + 1
	
	if d20 == 20:
		raw_dmg *= 2.0 # Crítico
		log_label.text = "CRÍTICO (D20)! Você bateu com " + weapon_name + " e causou " + str(raw_dmg) + " de dano!"
	elif d20 == 1:
		raw_dmg = 0 # Falha Crítica
		log_label.text = "FALHA CRÍTICA (D1)! Você errou o ataque."
	else:
		log_label.text = "Você atacou com " + weapon_name + " e causou " + str(raw_dmg) + " de dano."
		
	enemy_hp -= raw_dmg
	if enemy_hp < 0:
		enemy_hp = 0
		log_label.text += "\nO " + enemy_name + " foi derrotado!"
		
	update_ui()

func update_ui():
	enemy_hp_label.text = enemy_name + " HP: " + str(enemy_hp) + " / " + str(enemy_max_hp)
