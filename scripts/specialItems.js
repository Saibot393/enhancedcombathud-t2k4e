import { ModuleName } from "./utils.js";

const ItemReplacementID = "_argonUI_";

var VaesenECHSlowItems = {};

var VaesenECHFastItems = {};

var VaesenECHReactionItems = {};

function registerVaesenECHSItems () {
	VaesenECHSlowItems = {
		groupflags : {
			actiontype : "slow"
		},
		Persuade : {
			img: "modules/enhancedcombathud-t2k4e/icons/talk.svg",
			name: game.i18n.localize(ModuleName+".Titles.Persuade"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Persuade"),
				skill : "persuasion"
			}
		},
		Grapple : {
			img: "modules/enhancedcombathud-t2k4e/icons/grab.svg",
			name: game.i18n.localize(ModuleName+".Titles.Grapple"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Grapple"),
				skill : "closeCombat"
			}
		},
		BreakFree : {
			img: "modules/enhancedcombathud-t2k4e/icons/breaking-chain.svg",
			name: game.i18n.localize(ModuleName+".Titles.BreakFree"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.BreakFree"),
				skill : "closeCombat"
			}
		},
		ClearJam : {
			img: "modules/enhancedcombathud-t2k4e/icons/screwdriver.svg",
			name: game.i18n.localize(ModuleName+".Titles.ClearJam"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.ClearJam"),
				skill : "rangedCombat"
			}
		},
		Aim : {
			img: "modules/enhancedcombathud-t2k4e/icons/reticule.svg",
			name: game.i18n.localize(ModuleName+".Titles.Aim"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Aim"),
				skill : ""
			}
		},
		FirstAid : {
			img: "modules/enhancedcombathud-t2k4e/icons/first-aid-kit.svg",
			name: game.i18n.localize(ModuleName+".Titles.FirstAid"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.FirstAid"),
				skill : "medicalAid"
			}
		},
		Rally : {
			img: "modules/enhancedcombathud-t2k4e/icons/rally-the-troops.svg",
			name: game.i18n.localize(ModuleName+".Titles.Rally"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Rally"),
				skill : "command"
			}
		}
	}
	
	VaesenECHFastItems = {
		Cover : {
			actiontype : "fast"
		},
		CrossBarier : {
			img: "modules/enhancedcombathud-t2k4e/icons/jump-across.svg",
			name: game.i18n.localize(ModuleName+".Titles.CrossBarier"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.DrawWeapon"),
				skill : "mobility"
			}
		},
		GetUp : {
			img: "icons/svg/up.svg",
			name: game.i18n.localize(ModuleName+".Titles.GetUp"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Standup"),
				skill : ""
			}
		},
		Shove : {
			img: "icons/svg/falling.svg",
			name: game.i18n.localize(ModuleName+".Titles.Shove"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Shove"),
				skill : "closeCombat"
			}
		},
		Disarm : {
			img: "modules/enhancedcombathud-t2k4e/icons/drop-weapon.svg",
			name: game.i18n.localize(ModuleName+".Titles.Disarm"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Disarm"),
				skill : "closeCombat"
			}
		},
		GrappleAttack : {
			img: "modules/enhancedcombathud-t2k4e/icons/rally-the-troops.svg",
			name: game.i18n.localize(ModuleName+".Titles.GrappleAttack"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.GrappleAttack"),
				skill : "closeCombat"
			}
		},
		Retreat : {
			img: "modules/enhancedcombathud-t2k4e/icons/slap.svg",
			name: game.i18n.localize(ModuleName+".Titles.Retreat"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Retreat"),
				skill : "mobility"
			}
		},
		Reload : {
			img: "modules/enhancedcombathud-t2k4e/icons/reload-gun-barrel.svg",
			name: game.i18n.localize(ModuleName+".Titles.Reload"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Reload"),
				skill : "rangedCombat"
			}
		}
	}
	
	VaesenECHReactionItems = {
		groupflags : {
			actiontype : "react"
		},
		Drop : {
			img: "icons/svg/down.svg",
			name: game.i18n.localize(ModuleName+".Titles.Dodge"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Dodge"),
				skill : ""
			}
		},
		PartialtoFull : {
			img: "modules/enhancedcombathud/icons/armor-upgrade.webp",
			name: game.i18n.localize(ModuleName+".Titles.PartialtoFull"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.PartialtoFull"),
				skill : ""
			}
		},
		BreakFree : {
			img: "modules/enhancedcombathud/icons/svg/mighty-force.svg",
			name: game.i18n.localize(ModuleName+".Titles.BreakFree"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.BreakFree"),
				skill : "force",
				vaesenattribute : "might"
			}
		},
		Chase : {
			img: "modules/enhancedcombathud/icons/svg/walking-boot.svg",
			name: game.i18n.localize(ModuleName+".Titles.Chase"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Chase"),
				skill : "agility",
				vaesenattribute : "bodyControl"
			}
		}
	}
	
	//some preparation
	for (let itemset of [VaesenECHSlowItems, VaesenECHFastItems, VaesenECHReactionItems]) {
		for (let itemkey of Object.keys(itemset)) {
			if (itemkey != "groupflags") {
				itemset[itemkey].flags = {};
				itemset[itemkey].flags[ModuleName] = {...itemset.groupflags, ...itemset[itemkey].flags[ModuleName]};
				
				let ReplacementItem = game.items.find(item => item.name == ItemReplacementID + itemkey);
				
				if (ReplacementItem) {
					itemset[itemkey].system.description = ReplacementItem.system.description;
				}
			}
		}
		
		delete itemset.groupflags;
	}
}

export {registerVaesenECHSItems, VaesenECHSlowItems, VaesenECHFastItems, VaesenECHReactionItems}