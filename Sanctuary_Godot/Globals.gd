extends Node

# Gera um ID unico aleatorio
func uuid() -> String:
	var chars = "abcdefghijklmnopqrstuvwxyz0123456789"
	var res = ""
	for i in range(16):
		res += chars[randi() % chars.length()]
	return res

# Rola um dado (1 a max)
func rollDice(max_val: int) -> int:
	if max_val <= 1:
		return 1
	return (randi() % max_val) + 1

# Rola X dados de Y lados
func rollXDY(amount: int, sides: int) -> int:
	var total = 0
	for i in range(amount):
		total += rollDice(sides)
	return total

# Sorteio com pesos (rngEngine do JS)
func weighted_random(weights_dict: Dictionary) -> String:
	var total_weight = 0
	for key in weights_dict:
		total_weight += weights_dict[key]
	
	var random_val = randi() % int(total_weight)
	var current = 0
	
	for key in weights_dict:
		current += weights_dict[key]
		if random_val < current:
			return key
			
	return weights_dict.keys()[0] # Fallback