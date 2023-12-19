const ModuleName = "enhancedcombathud-t2k4e";
const SystemName = "t2k4e";
//import { T2KModifierDialog, T2KRoll } from "/systems/t2k4e/module/T2K-roll.js";

async function getTooltipDetails(item, actortype) {
	let title, description, itemType, creatureType, skillmodifiers, attributemodifiers, validskills, techTier, category, subtitle, subtitlecolor, range, automatic, power, radius, damage, bonus, quantity, initiative, crit, explosive, specials, hpbonus, mpbonus;
	let propertiesLabel = game.i18n.localize(SystemName + ".Special");
	let properties = [];
	let materialComponents = "";

	let details = [];
	
	if (!item || !item.system) return;

	title = item.name;
	description = item.system.description;
	itemType = item.type;
	creatureType = item.parent?.system.creatureType;
	skillmodifiers = [];
	attributemodifiers = [];
	validskills = item.system.skillKeysList;
	techTier = item.system.techTier;
	if (item.system.modifiers) {
		attributemodifiers = attributemodifiers.concat(Object.keys(item.system.modifiers).filter(key => item.system.modifiers[key] != 0 && !validskills.includes(key)));
		skillmodifiers = skillmodifiers.concat(Object.keys(item.system.modifiers).filter(key => item.system.modifiers[key] != 0 && validskills.includes(key)));
	}
	if (item.system.gearModifiers) {
		attributemodifiers = attributemodifiers.concat(Object.keys(item.system.gearModifiers).filter(key => item.system.gearModifiers[key] != 0 && !attributemodifiers.includes(key) && !validskills.includes(key)));
		skillmodifiers = skillmodifiers.concat(Object.keys(item.system.gearModifiers).filter(key => item.system.gearModifiers[key] != 0 && !skillmodifiers.includes(key) && validskills.includes(key)));
	}
	category = item.system.category;
	range = item.system?.range;
	automatic = item.system?.automatic;
	power = item.system?.blastPower;
	radius = item.system?.blastRadius;
	damage = item.system?.damage;
	bonus = item.system?.bonus;
	quantity = item.system?.quantity;
	initiative = item.system?.initiative;
	crit = item.system?.crit ? Object.values(item.system?.crit).filter(value => value).join("/") : "";
	explosive = item.system?.explosive;
	specials = item.system?.special;
	hpbonus = item.system?.hpBonus;
	mpbonus = item.system?.mpBonus;
	
	properties = [];

	switch (itemType) {
		case "weapon":
			switch (techTier) {
				default:
				case "P":
					subtitle = game.i18n.localize(`${SystemName}.TechTierPrimitive`);
					subtitlecolor = "#523d06";
					break;
				case "O":
					subtitle = game.i18n.localize(`${SystemName}.TechTierOrdinary`);
					break;
				case "A":
					subtitle = game.i18n.localize(`${SystemName}.TechTierAdvanced`);
					subtitlecolor = "#118209";
					break;
				case "F":
					subtitle = game.i18n.localize(`${SystemName}.TechTierFaction`);
					subtitlecolor = "#970ea1";
					break;
				case "R":
					subtitle = game.i18n.localize(`${SystemName}.TechTierPortalBuilderRelic`);
					subtitlecolor = "#ebb010"
					break;
			}
			if (specials) {
				properties.push(...(Object.values(specials).map(text => {return {label : text}})));
			}
			break;
		case "talent":
			let categoryName;
			switch (category) {
					case "group" :
						categoryName = "Group";
						break;
					case "icon" :
						categoryName = "Icon";
						break;
					case "general" :
						categoryName = "General";
						break;
					case "humanite" :
						categoryName = "Humanite";
						break;
					case "cybernetic" :
						categoryName = "Cybernetic";
						break;
					case "bionicsculpt" :
						categoryName = "BionicSculpt";
						break;
					case "mysticalpowers" :
						categoryName = "MysticalPowers";
						break;
			}
			subtitle = game.i18n.localize(`${SystemName}.TalentCat` + categoryName);
			break;
	}
	
	if (range) {
		range = firstUpperCase(range) + "Range";
	}
	
	if (radius) {
		radius = firstUpperCase(radius) + "Range";
	}

	switch (itemType) {
		case "weapon":
			details.push({
				label: SystemName + ".Bonus",
				value: bonus
			});
			details.push({
				label: SystemName + ".Initiative",
				value: initiative
			});
			details.push({
				label: SystemName + ".Damage",
				value: damage
			});
			details.push({
				label: SystemName + ".Crit",
				value: crit
			});
			
			if (explosive) {
				details.push({
					label: SystemName + ".BlastPower",
					value: power
				});
				details.push({
					label: SystemName + ".BlastRadius",
					value: game.i18n.localize(SystemName + "." + radius)
				});
			}
			else {
				details.push({
					label: SystemName + ".Range",
					value: game.i18n.localize(SystemName + "." + range)
				});
				details.push({
					label: SystemName + ".Automatic",
					value: automatic ? '<i class="fas fa-check"></i>' : 'test'
				});
			}
			break;
		case "gear":
			if (bonus) {
				details.push({
					label: SystemName + ".Bonus",
					value: bonus
				});
			}
			break;
		case "talent":
			if (hpbonus) {
				details.push({
					label: SystemName + ".HPBonus",
					value: hpbonus
				});
			}
			if (mpbonus) {
				details.push({
					label: SystemName + ".MPBonus",
					value: mpbonus
				});
			}
			break;
	}

	if (description) description = sanitize(description);
	
	if (quantity != undefined && details.length < 3) {
		details.push({
			label: SystemName + ".Quantity",
			value: quantity
		});		
	}

	return { title, description, subtitle, subtitlecolor, details, properties , propertiesLabel };
}

function rollCheck(type, id, actor) {
	let title;
	let attributeName;
	let skillName;
	let attribute = 0;
	let skill = 0;
	let askForOptions = false;
	let isRangedSkill;
	let isCombatSkill;
	
	switch (type) {
		case "attribute":
			attributeName = id;
			title = game.i18n.localize(CONFIG.T2K4E.attributes[id]);
			attribute = actor.system.attributes[attributeName].value;
			break;
		case "skill":
			skillName = id;
			attributeName = CONFIG.T2K4E.skillsMap[skillName];
			title = game.i18n.localize(CONFIG.T2K4E.skills[id]);
			skill = actor.system.skills[skillName].value;
			attribute = actor.system.attributes[attributeName].value;
            isRangedSkill = ["rangedCombat", "heavyWeapons"].includes(skillName)
            isCombatSkill = ["rangedCombat", "heavyWeapons", "closeCombat"].includes(skillName);
			break;
		case "combat":
			game.t2k4e.roller.cufCheck({
				actor: actor,
				unitMorale: id !== "cuf"
			})
			return;
			break;
	}
	
	game.t2k4e.roller.taskCheck({
		title : title,
		attributeName : attributeName,
		skillName : skillName,
		actor: actor,
		attribute : attribute,
		skill: skill,
		askForOptions: askForOptions,
		rof: isRangedSkill ? 6 : 0,
		locate: isCombatSkill
	});
}

function sanitize(string) {
	let parser = new DOMParser();
	
	let html = parser.parseFromString(string, 'text/html');
	
	return html.body.innerText;
}

function firstUpperCase(string) {
	return string[0].toUpperCase() + string.slice(1);
}

export { ModuleName, SystemName, getTooltipDetails, rollCheck, firstUpperCase }