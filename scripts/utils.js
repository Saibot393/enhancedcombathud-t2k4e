const ModuleName = "enhancedcombathud-t2k4e";
const SystemName = "t2k4e";
//import { T2KModifierDialog, T2KRoll } from "/systems/t2k4e/module/T2K-roll.js";

async function getTooltipDetails(item, actortype) {
	let description, itemType, type, skill, range, automatic, damage, rof, ammo, blast, quantity, crit, props, rollmods, armor;
	let title;
	let subtitle;
	let propertiesLabel = game.i18n.localize(ModuleName + ".Titles.Properties");
	let properties = [];
	let materialComponents = "";

	let details = [];
	
	if (!item || !item.system) return;

	title = item.name;
	description = item.system.description;
	itemType = item.type;
	type = item.system.itemType;
	skill = item.system?.skill;
	range = item.system?.range;
	automatic = item.system?.automatic;
	damage = item.system?.damage;
	rof = item.system?.rof;
	ammo = item.system?.ammo;
	blast = item.system?.blast;
	quantity = item.system?.qty;
	crit = item.system?.crit;
	props = item.system?.props;
	rollmods = item.system?.rollModifiers;
	armor = item.system?.armorModifier;
	
	properties = [];

	if (type) {
		subtitle = type;
	}
	else {
		if (skill) {
			subtitle = game.i18n.localize("T2K4E.SkillNames." + skill);
		}
	}

	switch (itemType) {
		case "weapon":
			details.push({
				label: "T2K4E.ItemSheet.Damage",
				value: damage
			});
			details.push({
				label: "T2K4E.ItemSheet.RoF",
				value: rof
			});
			details.push({
				label: "T2K4E.ItemSheet.Crit",
				value: crit
			});
			details.push({
				label: "T2K4E.ItemSheet.Blast",
				value: blast
			});
			details.push({
				label: "T2K4E.ItemSheet.Range",
				value: range
			});
			details.push({
				label: "T2K4E.ItemSheet.Ammo",
				value: ammo
			});
			details.push({
				label: "T2K4E.ItemSheet.Armor",
				value: armor
			});
			break;
		case "grenade":
			details.push({
				label: "T2K4E.ItemSheet.Damage",
				value: damage
			});
			details.push({
				label: "T2K4E.ItemSheet.Crit",
				value: crit
			});
			details.push({
				label: "T2K4E.ItemSheet.Range",
				value: range
			});
			details.push({
				label: "T2K4E.ItemSheet.Armor",
				value: armor
			});
			break;
	}
	
	if (props) {
		properties = Object.keys(props).filter(prop => props[prop]).map(prop => {return {label : "T2K4E.ItemPropNames." + prop}});
	}
	
	if (rollmods) {
		properties = properties.concat(Object.keys(rollmods).map(mod => {return {label : `${game.i18n.localize("T2K4E." + (rollmods[mod].name.split(".")[0] == "skill" ? "SkillNames." : "AttributeNames.") +rollmods[mod].name.split(".")[1])} ${rollmods[mod].value}`}}));
	}

	if (description) description = sanitize(description);
	
	if (quantity != undefined && details.length < 3) {
		details.push({
			label: "T2K4E.ItemSheet.Quantity",
			value: quantity
		});		
	}

	return { title, description, subtitle, details, properties , propertiesLabel };
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