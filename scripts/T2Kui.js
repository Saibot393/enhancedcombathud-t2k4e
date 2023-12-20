import {registerT2KECHSItems, T2KECHSlowItems, T2KECHFastItems, T2KECHFreeItems} from "./specialItems.js";
import {ModuleName, SystemName, getTooltipDetails, rollCheck, firstUpperCase} from "./utils.js";
import {openNewInput} from "./popupInput.js";

const talenttypes = ["group", "icon", "general", "humanite", "cybernetic", "bionicsculpt", "mysticalpowers"];

Hooks.on("argonInit", (CoreHUD) => {
    const ARGON = CoreHUD.ARGON;
  
	registerT2KECHSItems();
  
	function consumeAction(type) {
		switch(type) {
			case "slow":
				if (!ui.ARGON.components.main[0].isActionUsed) {
					ui.ARGON.components.main[0].isActionUsed = true;
					ui.ARGON.components.main[0].updateActionUse();
					return true;
				}
				break;
			case "fast":
				if (!ui.ARGON.components.main[1].isActionUsed) {
					ui.ARGON.components.main[1].isActionUsed = true;
					ui.ARGON.components.main[1].updateActionUse();
					return true;
				}
				else {
					return consumeAction("slow");
				}
				break;
		}
		
		return false;
	}
  
    class T2KPortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
		constructor(...args) {
			super(...args);
			
			this.usedArmor = {};
			
			Hooks.on("updateItem", (item, changes, infos, userid) => {
				if (item.actor == this.actor) {
					if (item?.system.equipped) {
						this.render();
					}
				}
			});
		}

		get description() {
			return `${this.actor.system.bio.militaryRank}`;
		}

		get isDead() {
			let isDead = (this.actor.system.health?.value == 0 && this.actor.system.health?.max != 0) || (this.actor.system.sanity?.value == 0 && this.actor.system.sanity?.max != 0);
			
			return isDead;
		}
		
		async getsideStatBlocks() {
			let stats = {};
			
			for (let stat of ["health", "sanity"]) {
				stats[stat] = this.actor.system[stat];
			}
			
			this.usedArmor = {};
			let armoritems = this.actor.items.filter(item => item.type == "armor" && item.system.equipped);
			for (let armorlocation of ["legs", "torso", "arms", "head"]) {
				let fittingitems = armoritems.filter(item => item.system.location[armorlocation]);
				
				let ArmorValue = -1;
				
				fittingitems.forEach((armoritem) => {if (armoritem.system.rating.value > ArmorValue) {ArmorValue = armoritem.system.rating.value; this.usedArmor[armorlocation] = armoritem;}});
				
				stats[armorlocation] = this.usedArmor[armorlocation]?.system.rating;
			}
			
			let Blocks = {left : [], right : []};
			
			for (let key of Object.keys(stats)) {
				if (stats[key]) {
					let position = "";
					
					let onchange;
					switch(key) {
						case "health" :
						case "sanity":
							position = "left";
							onchange = (newvalue) => this.actor.update({system : {[key] : {value : newvalue}}})
							break;
						case "arms" :
						case "head":
						case "legs":
						case "torso":
							position = "right";
							onchange = (newvalue) => this.usedArmor[key].update({system : {rating : {value : newvalue}}})
							break;
					}
					
					let icon;
					switch(key) {
						case "health" : icon = [`fa-solid`, `fa-heart`]; break;
						case "sanity":	icon = [`fa-solid`, `fa-brain`]; break;
						case "arms" :	icon = [`fa-solid`, `fa-hand`]; break;
						case "head":	icon = [`fa-solid`, `fa-helmet-safety`]; break;
						case "legs":	icon = [`fa-solid`, `fa-socks`]; break;
						case "torso":	icon = [`fa-solid`, `fa-shirt`]; break;
					}
					
					Blocks[position].unshift([
						{
							icon: icon,
						},
						{
							isinput : true,
							inputtype : "number",
							text: stats[key].value,
							changevent : onchange
						},
						{
							text: "/",
						},
						{
							text: stats[key].max
						}
					]);
				}
			}
			
			return Blocks;
		}
		
		async _renderInner(data) {
			await super._renderInner(data);
			
			const statBlocks = await this.getsideStatBlocks();
			for (const position of ["left", "right"]) {
				const sb = document.createElement("div");
				
				sb.style = `position : absolute;${position} : 0px`;
				
				for (const block of statBlocks[position]) {
					const sidesb = document.createElement("div");
					sidesb.classList.add("portrait-stat-block");
					sidesb.style.paddingLeft = "0.35em";
					sidesb.style.paddingRight = "0.35em";
					if (statBlocks[position].length > 2) {
						sidesb.style.paddingTop = "2px";
						sidesb.style.paddingBottom = "2px";
					}
					for (const stat of block) {
						if (!stat.position) {
							let displayer;
							if (stat.isinput) {
								displayer = document.createElement("input");
								displayer.type = stat.inputtype; 
								displayer.value = stat.text;
								displayer.style.width = "1.5em";
								displayer.style.color = "#ffffff";
								displayer.onchange = () => {stat.changevent(displayer.value)};
							}
							else {
								displayer = document.createElement("span");
								displayer.innerText = ``;
								if (stat.text) {
									displayer.innerText = displayer.innerText + stat.text;
								}
								if (stat.icon) {
									let icon = document.createElement("i");
									icon.classList.add(...stat.icon);
									displayer.appendChild(icon);
								}
							}
							displayer.style.color = stat.color;
							sidesb.appendChild(displayer);
						}
					}
					sb.appendChild(sidesb);
				}
				this.element.appendChild(sb);
			}
			
			this.element.querySelector(".player-buttons").style.right = "0%";
		}
	}
	
	class T2KDrawerPanel extends ARGON.DRAWER.DrawerPanel {
		constructor(...args) {
			super(...args);
		}

		get categories() {
			const attributes = this.actor.system.attributes;
			const skills = this.actor.system.skills;
			const combats = {cuf : this.actor.system.cuf, unitMorale : this.actor.system.unitMorale};

			const attributesButtons = Object.keys(attributes).map((attribute) => {
				const attributeData = attributes[attribute];
				
				let valueLabel;
				if (attributeData.value > 0) {
					valueLabel = `${attributeData.score} (D${attributeData.value})`;
				}
				else {
					valueLabel = `${attributeData.score} (D0)`;
				}
				
				return new ARGON.DRAWER.DrawerButton([
					{
						label: game.i18n.localize(CONFIG.T2K4E.attributes[attribute]),
						onClick: () => {rollCheck("attribute", attribute, this.actor)}
					},
					{
						label: valueLabel,
						onClick: () => {rollCheck("attribute", attribute, this.actor)},
						style: "display: flex; justify-content: flex-end;"
					}
				]);
			});
			
			const skillsButtons = Object.keys(skills).map((skill) => {
				const skillData = skills[skill];
				const attributeData = attributes[CONFIG.T2K4E.skillsMap[skill]];
				
				let valueLabel;
				
				if (skillData.value > 0) {
					valueLabel = `${skillData.score} (d${skillData.value})`
				}
				else {
					valueLabel = `${skillData.score}`;
				}
				
				let attributelabel;
				if (attributeData.value > 0) {
					attributelabel = `<span style="margin: 0 1rem; filter: brightness(0.8)">(+D${attributeData.value})</span>`;
				}
				else {
					attributelabel = `<span style="margin: 0 1rem; filter: brightness(0.8)">(+D0)</span>`;
				}
				
				return new ARGON.DRAWER.DrawerButton([
					{
						label: game.i18n.localize(CONFIG.T2K4E.skills[skill]),
						onClick: () => {rollCheck("skill", skill, this.actor)}
					},
					{
						label: valueLabel,
						onClick: () => {rollCheck("skill", skill, this.actor)},
						style: "display: flex; justify-content: flex-end;"
					},
					{
						label: attributelabel,
						onClick: () => {rollCheck("skill", skill, this.actor)},
						style: "display: flex; justify-content: flex-end;"
					}
				]);
			});
			
			const combatsButtons = Object.keys(combats).map((combat) => {
				const attributeData = combats[combat];
				
				let valueLabel;
				if (attributeData.value > 0) {
					valueLabel = `${attributeData.score} (D${attributeData.value})`;
				}
				else {
					valueLabel = `${attributeData.score} (D0)`;
				}
				
				return new ARGON.DRAWER.DrawerButton([
					{
						label: game.i18n.localize("T2K4E.ActorSheet" + combat=="cuf" ? "CuF" : "UnitMorale"),
						onClick: () => {rollCheck("combat", combat, this.actor)}
					},
					{
						label: valueLabel,
						onClick: () => {rollCheck("combat", combat, this.actor)},
						style: "display: flex; justify-content: flex-end;"
					}
				]);
			});

			let returncategories = [];


			returncategories.push({
				gridCols: "7fr 2fr",
				captions: [
					{
						label: game.i18n.localize(ModuleName+".Titles.Attributes"),
					},
					{
						label: game.i18n.localize(ModuleName+".Titles.ROLL"),
					},
				],
				buttons: attributesButtons
			});

			returncategories.push({
				gridCols: "7fr 2fr 2fr",
				captions: [
					{
						label: game.i18n.localize("T2K4E.Skills"),
					},
					{
						label: "",
					},
					{
						label: "",
					}
				],
				buttons: skillsButtons,
			});
			
			returncategories.push({
				gridCols: "7fr 2fr",
				captions: [
					{
						label: game.i18n.localize("T2K4E.ActorSheet.Combat"),
					},
					{
						label: "",
					},
				],
				buttons: combatsButtons
			});
			
			return returncategories;
		}

		get title() {
			return `${game.i18n.localize(ModuleName+".Titles.Attributes")}, ${game.i18n.localize("T2K4E.Skills")} & ${game.i18n.localize("T2K4E.ActorSheet.Combat")}`;
		}
	}
  
    class T2KSlowActionPanel extends ARGON.MAIN.ActionPanel {
		constructor(...args) {
			super(...args);
			
			this.actionsLeft = this.maxActions;
		}

		get label() {
			return ModuleName+".Titles.SlowAction";
		}
		
		get maxActions() {
            return 1;
        }
		
		get currentActions() {
			return this.isActionUsed ? 0 : 1;
		}
		
		_onNewRound(combat) {
			this.isActionUsed = false;
			this.updateActionUse();
		}
		
		async _getButtons() {
			const specialActions = Object.values(T2KECHSlowItems);

			let buttons = [];
			
			buttons.push(new T2KItemButton({ item: null, isWeaponSet: true, isPrimary: true }));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[0]), new T2KSpecialActionButton(specialActions[1])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[2]), new T2KSpecialActionButton(specialActions[3])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[4]), new T2KSpecialActionButton(specialActions[5])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[6]), new T2KSpecialActionButton(specialActions[7])));
			
			return buttons.filter(button => button.items == undefined || button.items.length);
		}
    }
	
    class T2KFastActionPanel extends ARGON.MAIN.ActionPanel {
		constructor(...args) {
			super(...args);
			
			this.actionsLeft = this.maxActions;
		}
		
		get label() {
			return ModuleName+".Titles.FastAction";
		}

		get maxActions() {
            return 1;
        }
		
		get currentActions() {
			return this.isActionUsed ? 0 : 1;
		}
		
		_onNewRound(combat) {
			this.isActionUsed = false;
			this.updateActionUse();
		}
		
		async _getButtons() {
			const specialActions = Object.values(T2KECHFastItems);

			let buttons = [];
			
			buttons.push(new T2KButtonPanelButton({type: "gear", color: 1}));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[0]), new T2KSpecialActionButton(specialActions[1])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[2]), new T2KSpecialActionButton(specialActions[3])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[4]), new T2KSpecialActionButton(specialActions[5])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[6]), new T2KSpecialActionButton(specialActions[7])));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[8]), new T2KSpecialActionButton(specialActions[9])));
			
			return buttons.filter(button => button.items == undefined || button.items.length);
		}
    }
	
    class T2KFreeActionPanel extends ARGON.MAIN.ActionPanel {
		constructor(...args) {
			super(...args);
		}

		get label() {
			return ModuleName+".Titles.FreeAction";
		}
		
		async _getButtons() {
			const specialActions = Object.values(T2KECHFreeItems);

			let buttons = [];
			
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[0]), new T2KSpecialActionButton(specialActions[1])));
			
			return buttons.filter(button => button.items == undefined || button.items.length);
		}
    }
	
	class T2KItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
		constructor(...args) {
			super(...args);
			
			if (this.item?.type == "weapon" || this.item?.type == "grenade" || this.isWeaponSet) {
				Hooks.on("updateActor", (actor, changes, infos, sender) => {
					if (this.quantity != null) {
						if (this.actor == actor) {
							this.render();
						}
					}
				});
				
				Hooks.on("updateItem", (item, changes, infos, sender) => {
					if (this.actor == item.parent) {
						if (this.item?.system.ammo == item.name) {
							this.render();
						}
					}
				});
			}
		}

		get hasTooltip() {
			return true;
		}

		get targets() {
			return null;
		}

		async getTooltipData() {
			const tooltipData = await getTooltipDetails(this.item, this.actor.system.creatureType);
			return tooltipData;
		}
		
		async _onTooltipMouseEnter(event) {
			const tooltipData = await this.getTooltipData();
			if (!tooltipData) return;
			this._tooltip = new ARGON.CORE.Tooltip(tooltipData, this.element, this.tooltipOrientation);
			this._tooltip.render();
		}

		get quantity() {
			switch (this.item.type) {
				case "weapon":
				case "grenade":
					if (this.item?.system.props?.disposable) {
						return this.item.system.qty;
					}
					
					if (this.item?.system.ammo) {
						let ammoitems = this.actor.items.filter(item => item.name == this.item?.system.ammo);
						
						let count = 0;
						
						for (const ammoitem of ammoitems) {
							count = count + ammoitem.system.qty * ammoitem.system.ammo.value;
						}
						
						return count;
					}
					break;
				default: 
					if (this.item.system?.hasOwnProperty("qty")) {
						return this.item.system.qty;
					}
					break;
			}
			
			return null;
		}
		
		async _onLeftClick(event, special = "") {
			if (!(event.target.id != "specialAction" || special)) return;
			
			var used = false;
			
			if (this.item.type == "weapon" || this.item.type == "grenade") {
				used = true;
				
				this.item.rollAttack({}, this.actor);
			}
			
			if (this.item.type == "gear") {
				this.item.displayCard();
				
				used = true;
			}	
			
			if (used) {
				T2KItemButton.consumeActionEconomy(this.item);
			}
		}
		
		async _onTooltipMouseEnter(event) {
			await super._onTooltipMouseEnter(event);
			
			if (this.element.querySelector("#specialAction")) {
				this.element.querySelector("#maintitle").style.visibility = "hidden";
				for (const specialelement of this.element.querySelectorAll("#specialAction")) {
					specialelement.style.visibility = "";
				}
			}
		}

		async _onTooltipMouseLeave(event) {
			await super._onTooltipMouseLeave(event);
			
			if (this.element.querySelector("#maintitle")) {
				this.element.querySelector("#maintitle").style.visibility = "";
				for (const specialelement of this.element.querySelectorAll("#specialAction")) {
					specialelement.style.visibility = "hidden";
				}
			}
		}
	
		async _renderInner(data) {
			await super._renderInner(data);
		}
		
		static consumeActionEconomy(item) {
			switch (item.type) {
				case "weapon":
				case "grenade":
					consumeAction("slow");
					break;
				case "gear":
					consumeAction("fast");
					break;
			}
		}
	}
  
    class T2KButtonPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton {
		constructor({type, subtype, color, typeblacklist = []}) {
			super();
			this.type = type;
			this.color = color;
			this.subtype = subtype;
			this.typeblacklist = typeblacklist;
		}

		get colorScheme() {
			return this.color;
		}

		get label() {
			switch (this.type) {
				case "gear": return ModuleName+".Titles.Gear";
			}
		}

		get icon() {
			switch (this.type) {
				case "gear": return "modules/enhancedcombathud/icons/svg/backpack.svg";
			}
		}
		
		async _getPanel() {
			let validitems = this.actor.items.filter(item => item.type == this.type);
			
			if (this.type = "talent") {
				switch (this.subtype) {
					case "general" :
						validitems = validitems.filter(item => !(this.typeblacklist.includes(item.system.category)));
						break;
					default :
						validitems = validitems.filter(item => item.system.category == this.subtype);
						break;
				}
			}
			
			return new ARGON.MAIN.BUTTON_PANELS.ButtonPanel({buttons: validitems.map(item => new T2KItemButton({item}))});
		}
    }
	
	class T2KSpecialActionButton extends ARGON.MAIN.BUTTONS.ActionButton {
        constructor(specialItem) {
			super();
			this.item = new CONFIG.Item.documentClass(specialItem, {
				parent: this.actor,
			});
		}

		get label() {
			return this.item.name;
		}

		get icon() {
			return this.item.img;
		}

		get hasTooltip() {
			return true;
		}
		
		get colorScheme() {
			switch (this.item?.flags[ModuleName]?.actiontype) {
				case "slow":
					return 0;
					break;
				case "fast":
					return 1;
					break;
				case "free":
					return 2;
					break;
			}
			return 0;
		}

		async getTooltipData() {
			const tooltipData = await getTooltipDetails(this.item, this.actor.system.creatureType);
			return tooltipData;
		}
		
		async _onLeftClick(event) {
			var used = true;
			
			const item = this.item;
			
			if (this.item.system.skill) {
				rollCheck("skill", this.item.system.skill, this.actor);
			}
			
			if (used) {
				consumeAction(item.flags[ModuleName].actiontype);
			}
		}
    }
	
	class T2KWeaponSets extends ARGON.WeaponSets {
		constructor(...args) {
			super(...args);
			
			this.lastdragID = "";
			/*
			Hooks.on("renderActorSheet", (sheet, html, infos) => {
				if (sheet.actor == this.actor) {
					const weaponelements = html.find(`li .roll-weapon`);
					
					weaponelements.each((i, element) => {
						element.draggable = true;
						
						let id = element.getAttribute("data-item-id");
						
						element.ondragstart = () => {
							this.lastdragID = id;
						};
						
						element.ondragend = () => {
							if (this.lastdragID == id) {
								this.lastdragID = "";
							}
						};
					})
				}
			});
			*/
		}
		
		async getDefaultSets() {
			let attacks = this.actor.items.filter((item) => ["weapon", "grenade"].includes(item.type));
			
			return {
				1: {
					primary: attacks[0]?.id ?? null,
					secondary: null,
				},
				2: {
					primary: attacks[1]?.id ?? null,
					secondary: null,
				},
				3: {
					primary: attacks[2]?.id ?? null,
					secondary: null,
				},
			};
		}

		async _onSetChange({sets, active}) {
			const updates = [];
			const activeSet = sets[active];
			const activeItems = Object.values(activeSet).filter((item) => item);
			const inactiveSets = Object.values(sets).filter((set) => set !== activeSet);
			const inactiveItems = inactiveSets.flatMap((set) => Object.values(set)).filter((item) => item);
			activeItems.forEach((item) => {
				if(!item.system?.equipped) updates.push({_id: item.id, "system.equipped": true});
			});
			inactiveItems.forEach((item) => {
				if(item.system?.equipped) updates.push({_id: item.id, "system.equipped": false});
			});
			return await this.actor.updateEmbeddedDocuments("Item", updates);
		}

		async _getSets() { //overwrite because slots.primary/secondary contains id, not uuid
			const sets = mergeObject(await this.getDefaultSets(), deepClone(this.actor.getFlag("enhancedcombathud", "weaponSets") || {}));

			for (const [set, slots] of Object.entries(sets)) {
				slots.primary = slots.primary ? await this.actor.items.get(slots.primary) : null;
				slots.secondary = null;
			}
			return sets;
		}
		
		async _onDrop(event) {
			try {      
				event.preventDefault();
				event.stopPropagation();
				const data = JSON.parse(event.dataTransfer.getData("text/plain"));
				const item = await fromUuid(data.uuid);
				if(! ["weapon", "grenade"].includes(item?.type)) return;
				const set = event.currentTarget.dataset.set;
				const slot = event.currentTarget.dataset.slot;
				const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
				sets[set] = sets[set] || {};
				sets[set][slot] = item.id;
				await this.actor.setFlag("enhancedcombathud", "weaponSets", sets);
				await this.render();
			} catch (error) {
				
			}
		}
		
		get template() {
			return `modules/${ModuleName}/templates/T2KWeaponSets.hbs`;
		}
		
		async getactiveSet() {
			const sets = await this._getSets();
			return sets[this.actor.getFlag("enhancedcombathud", "activeWeaponSet")];
		}
    }
  
    /*
    class T2KEquipmentButton extends ARGON.MAIN.BUTTONS.EquipmentButton {
		constructor(...args) {
			super(...args);
		}
    }
	*/
  
    CoreHUD.definePortraitPanel(T2KPortraitPanel);
    CoreHUD.defineDrawerPanel(T2KDrawerPanel);
    CoreHUD.defineMainPanels([
		T2KSlowActionPanel,
		T2KFastActionPanel,
		T2KFreeActionPanel,
		ARGON.PREFAB.PassTurnPanel
    ]);  
	CoreHUD.defineMovementHud(null);
	CoreHUD.defineWeaponSets(T2KWeaponSets);
	CoreHUD.defineSupportedActorTypes(["character", "npc"]);
});
