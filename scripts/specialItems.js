import { ModuleName } from "./utils.js";

const ItemReplacementID = "_argonUI_";

var T2KECHSlowItems = {};

var T2KECHFastItems = {};

var T2KECHFreeItems = {};

function registerT2KECHSItems () {
	T2KECHSlowItems = {
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
		/*
		Aim : {
			img: "modules/enhancedcombathud-t2k4e/icons/reticule.svg",
			name: game.i18n.localize(ModuleName+".Titles.Aim"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Aim"),
				skill : ""
			}
		},
		*/
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
		}/*,
		EnterExit : {
			img: "modules/enhancedcombathud-t2k4e/icons/exit-door.svg",
			name: game.i18n.localize(ModuleName+".Titles.EnterExit"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.EnterExit"),
				skill : ""
			}
		}
		*/
	}
	
	T2KECHFastItems = {
		groupflags : {
			actiontype : "fast"
		},
		Cover : {
			img: "modules/enhancedcombathud-t2k4e/icons/shield.svg",
			name: game.i18n.localize(ModuleName+".Titles.Cover"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Cover"),
				skill : ""
			}
		},
		FulltoPartial : {
			img: "modules/enhancedcombathud-t2k4e/icons/armor-downgrade.svg",
			name: game.i18n.localize(ModuleName+".Titles.FulltoPartial"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.FulltoPartial"),
				skill : ""
			}
		},
		Run : {
			img: "modules/enhancedcombathud-t2k4e/icons/run.svg",
			name: game.i18n.localize(ModuleName+".Titles.Run"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Run"),
				skill : "mobility"
			}
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
			img: "modules/enhancedcombathud-t2k4e/icons/slap.svg",
			name: game.i18n.localize(ModuleName+".Titles.GrappleAttack"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.GrappleAttack"),
				skill : "closeCombat"
			}
		},
		Retreat : {
			img: "modules/enhancedcombathud-t2k4e/icons/return-arrow.svg",
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
	
	T2KECHFreeItems = {
		groupflags : {
			actiontype : "free"
		},
		Drop : {
			img: "icons/svg/down.svg",
			name: game.i18n.localize(ModuleName+".Titles.Drop"),
			type : "base",
			system : {
				description : game.i18n.localize(ModuleName+".Descriptions.Drop"),
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
		}
	}
	
	//some preparation
	for (let itemset of [T2KECHSlowItems, T2KECHFastItems, T2KECHFreeItems]) {
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

export {registerT2KECHSItems, T2KECHSlowItems, T2KECHFastItems, T2KECHFreeItems}