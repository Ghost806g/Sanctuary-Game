extends Control

# === Configurações do Inimigo ===
@export var enemy_name: String = "Caustic Slime"
@export var enemy_max_hp: int = 1600
var enemy_hp: int

# === Configurações do Herói ===
@export var hero_name: String = "Guerreiro"
@export var hero_max_hp: int = 300
var hero_hp: int
@export var hero_atk: int = 200

# === Referências aos Nós da Interface ===
@onready var enemy_hp_bar: ProgressBar = $HUD/TopBar/EnemyPanel/VBox/EnemyHPBar
@onready var enemy_name_label: Label = $HUD/TopBar/EnemyPanel/VBox/EnemyNameLabel
@onready var enemy_sprite: TextureRect = $HUD/CenterArea/EnemySprite

@onready var hero_hp_bar: ProgressBar = $HUD/TopBar/HeroPanel/HBox/VBox/HeroHPBar
@onready var hero_name_label: Label = $HUD/TopBar/HeroPanel/HBox/VBox/HeroNameLabel
@onready var hero_portrait: TextureRect = $HUD/TopBar/HeroPanel/HBox/HeroPortrait

@onready var attack_button: Button = $HUD/BottomBar/AttackButton
@onready var item_button: Button = $HUD/BottomBar/ItemButton
@onready var inventory_screen: Control = $HUD/InventoryScreen

# === Camada de Números Flutuantes ===
@onready var float_layer: CanvasLayer = $FloatLayer

func _ready():
	enemy_hp = enemy_max_hp
	hero_hp = hero_max_hp
	
	var minha_espada = load("res://Lamina_Enferrujada.tres").duplicate()
	if minha_espada:
		InventoryManager.equip_item(minha_espada, "arma")
		
	var pocao_base = load("res://Pocao_Vida.tres")
	if pocao_base:
		InventoryManager.add_item_to_bag(pocao_base.duplicate())
		InventoryManager.add_item_to_bag(pocao_base.duplicate())
	
	attack_button.pressed.connect(_on_attack_pressed)
	item_button.pressed.connect(func(): inventory_screen.show())
	
	_update_all_ui()
	_spawn_floating_text("Um %s selvagem aparece!" % enemy_name, Vector2(640, 300), Color.CYAN, 1.5)

func _on_attack_pressed():
	if enemy_hp <= 0:
		return
	
	# Calcula dano com arma equipada
	var raw_dmg = hero_atk
	var weapon_name = "Punhos"
	
	if InventoryManager.equipment["arma"] != null:
		var arma = InventoryManager.equipment["arma"]
		raw_dmg += arma.damage
		weapon_name = arma.name
	
	var d20 = randi() % 20 + 1
	
	# Posição do monstro na tela (centro do sprite)
	var enemy_center = Vector2(640, 250)
	var hero_center = Vector2(160, 120)
	
	if d20 == 20:
		raw_dmg *= 2
		# Crítico: Número grande e dourado
		_spawn_floating_text("CRÍTICO!", enemy_center + Vector2(0, -40), Color.GOLD, 1.2, 48)
		_spawn_floating_text(str(raw_dmg), enemy_center, Color.GOLD, 1.0, 64)
		_shake_enemy(20.0)
	elif d20 == 1:
		raw_dmg = 0
		_spawn_floating_text("MISS!", enemy_center, Color.GRAY, 1.0, 40)
	else:
		# Dano normal: Número branco
		_spawn_floating_text(str(raw_dmg), enemy_center + Vector2(randf_range(-30, 30), 0), Color.WHITE, 0.8, 36)
		_shake_enemy(10.0)
	
	enemy_hp -= raw_dmg
	if enemy_hp < 0:
		enemy_hp = 0
	
	if enemy_hp <= 0:
		_spawn_floating_text("VITÓRIA!", Vector2(640, 350), Color.LIME_GREEN, 2.0, 56)
		attack_button.disabled = true
		attack_button.text = "VITÓRIA!"
	
	# Contra-ataque
	if enemy_hp > 0:
		_enemy_turn()
	
	_update_all_ui()

func _enemy_turn():
	var enemy_dmg = randi() % 40 + 10
	hero_hp -= enemy_dmg
	if hero_hp < 0:
		hero_hp = 0
	
	# Dano do monstro aparece em vermelho perto do retrato do herói
	var hero_center = Vector2(160, 100)
	_spawn_floating_text(str(enemy_dmg), hero_center + Vector2(randf_range(-20, 20), 0), Color.ORANGE_RED, 0.8, 32)
	_shake_node(hero_portrait, 8.0)
	
	if hero_hp <= 0:
		_spawn_floating_text("DERROTA...", Vector2(640, 350), Color.RED, 2.0, 56)
		attack_button.disabled = true
		attack_button.text = "DERROTA"

func _update_all_ui():
	enemy_hp_bar.max_value = enemy_max_hp
	enemy_hp_bar.value = enemy_hp
	enemy_name_label.text = "%s  %d / %d" % [enemy_name, enemy_hp, enemy_max_hp]
	
	hero_hp_bar.max_value = hero_max_hp
	hero_hp_bar.value = hero_hp
	hero_name_label.text = "%s  %d / %d" % [hero_name, hero_hp, hero_max_hp]
	
	# Cores dinâmicas nas barras
	var enemy_pct = float(enemy_hp) / float(enemy_max_hp)
	if enemy_pct < 0.25:
		enemy_hp_bar.modulate = Color(1.0, 0.2, 0.2)
	elif enemy_pct < 0.5:
		enemy_hp_bar.modulate = Color(1.0, 0.8, 0.0)
	else:
		enemy_hp_bar.modulate = Color(0.8, 0.2, 0.2)
	
	var hero_pct = float(hero_hp) / float(hero_max_hp)
	if hero_pct < 0.25:
		hero_hp_bar.modulate = Color(1.0, 0.2, 0.2)
	elif hero_pct < 0.5:
		hero_hp_bar.modulate = Color(1.0, 0.8, 0.0)
	else:
		hero_hp_bar.modulate = Color(0.2, 0.8, 0.2)

# === SISTEMA DE NÚMEROS FLUTUANTES ===
func _spawn_floating_text(text: String, pos: Vector2, color: Color, duration: float = 1.0, font_size: int = 32):
	var label = Label.new()
	label.text = text
	label.add_theme_color_override("font_color", color)
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_outline_color", Color.BLACK)
	label.add_theme_constant_override("outline_size", 4)
	label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	label.position = pos - Vector2(100, 20)
	label.custom_minimum_size = Vector2(200, 40)
	
	float_layer.add_child(label)
	
	# Animação: sobe e some
	var tween = create_tween().set_parallel(true)
	tween.tween_property(label, "position:y", pos.y - 80, duration).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)
	tween.tween_property(label, "modulate:a", 0.0, duration * 0.6).set_delay(duration * 0.4)
	tween.tween_property(label, "scale", Vector2(1.3, 1.3), duration * 0.15).set_ease(Tween.EASE_OUT)
	tween.chain().tween_property(label, "scale", Vector2(1.0, 1.0), duration * 0.1)
	
	# Remove o label quando a animação acabar
	await tween.finished
	label.queue_free()

func _shake_enemy(intensity: float = 10.0):
	var original_pos = enemy_sprite.position
	var tween = create_tween()
	tween.tween_property(enemy_sprite, "position", original_pos + Vector2(intensity, 0), 0.04)
	tween.tween_property(enemy_sprite, "position", original_pos + Vector2(-intensity, 0), 0.04)
	tween.tween_property(enemy_sprite, "position", original_pos + Vector2(intensity * 0.5, 0), 0.04)
	tween.tween_property(enemy_sprite, "position", original_pos, 0.04)

func _shake_node(node: Control, intensity: float = 8.0):
	var original_pos = node.position
	var tween = create_tween()
	tween.tween_property(node, "position", original_pos + Vector2(intensity, 0), 0.04)
	tween.tween_property(node, "position", original_pos + Vector2(-intensity, 0), 0.04)
	tween.tween_property(node, "position", original_pos + Vector2(intensity * 0.5, 0), 0.04)
	tween.tween_property(node, "position", original_pos, 0.04)
