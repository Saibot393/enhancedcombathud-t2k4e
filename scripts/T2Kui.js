import {registerT2KECHSItems, T2KECHActionItems, T2KECHFreeActionItems} from "./specialItems.js";
import {ModuleName, SystemName, getTooltipDetails, rollCheck, firstUpperCase} from "./utils.js";
import {openNewInput} from "./popupInput.js";

const talenttypes = ["group", "icon", "general", "humanite", "cybernetic", "bionicsculpt", "mysticalpowers"];

Hooks.on("argonInit", (CoreHUD) => {
    const ARGON = CoreHUD.ARGON;
  
	registerT2KECHSItems();
  
	function consumeAction(amount) {
		if (ui.ARGON.components.main[0].currentActions >= amount) {
			ui.ARGON.components.main[0].currentActions = ui.ARGON.components.main[0].currentActions - amount;
			return true;
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
			
			this.wasDead = {};
		}

		get description() {
			return `${this.actor.system.bio.concept}`;
		}

		get isDead() {
			let isDead = {};
			
			this.wasDead = isDead;
			
			return Object.values(isDead).find(value => value);
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
		}
		
		static async rollInjuries() {
			let table = await fromUuid("RollTable." + game.settings.get(ModuleName, "InjurieTable"));
			if (table) {
				table.draw({roll: true, displayChat: true});
			}
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
						label: game.i18n.localize("CONFIG.T2K4E." + combat),
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
						label: game.i18n.localize(SystemName+".Attributes"),
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
						label: game.i18n.localize(SystemName+".SkillCat"),
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
						label: game.i18n.localize(SystemName+".Attributes"),
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
			return `${game.i18n.localize(SystemName+".Attributes")} & ${game.i18n.localize(ModuleName+".Titles.Skills")}`;
		}
	}
  
    class T2KActionActionPanel extends ARGON.MAIN.ActionPanel {
		constructor(...args) {
			super(...args);
			
			this.actionsLeft = this.maxActions;
		}

		get label() {
			return ModuleName+".Titles.ActionAction";
		}
		
		get maxActions() {
            return 3;
        }
		
		get currentActions() {
			return this.actionsLeft;
		}
		
		set currentActions(value) {
			this.actionsLeft = value;
			this.updateActionUse();
		}
		
		_onNewRound(combat) {
			this.actionsLeft = this.maxActions;
			this.updateActionUse();
		}
		
		async _getButtons() {
			const specialActions = Object.values(T2KECHActionItems);

			let buttons = [];
			
			let talentbuttons = [];
			let generalBlacklist = [];
			const talentsThreshold = game.settings.get(ModuleName, "TalentsThreshold");
			
			let talents = this.actor.items.filter(item => item.type == "talent");
			
			for (const subtype of talenttypes.filter(type => type != "general")) {
				if (talents.filter(item => item.system.category == subtype).length >= talentsThreshold) {
					talentbuttons.push(new T2KButtonPanelButton({type: "talent", subtype: subtype, color: 0}));
					generalBlacklist.push(subtype);
				}
			}
			
			if (talents.find(item => !generalBlacklist.includes(item.system.category))) {
				talentbuttons.unshift(new T2KButtonPanelButton({type: "talent", subtype: "general", color: 0, typeblacklist : generalBlacklist}));
			}
			
			buttons.push(new T2KItemButton({ item: null, isWeaponSet: true, isPrimary: true }));
			buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new T2KSpecialActionButton(specialActions[0]), new T2KSpecialActionButton(specialActions[1])));
			buttons.push(...talentbuttons);
			buttons.push(new T2KButtonPanelButton({type: "gear", color: 0}));
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
			const specialActions = Object.values(T2KECHFreeActionItems);

			const buttons = [
				new T2KSpecialActionButton(specialActions[0])
			];
			return buttons.filter(button => button.items == undefined || button.items.length);
		}
    }
	
	class T2KItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
		constructor(...args) {
			super(...args);
			
			if (this.item?.type == "weapon") {
				Hooks.on("updateActor", (actor, changes, infos, sender) => {
					if (this.quantity != null) {
						if (this.actor == actor) {
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
			this._tooltip = new T2KTooltip(tooltipData, this.element, this.tooltipOrientation);
			this._tooltip.render();
		}

		get quantity() {
			return null;
		}
		
		async _onLeftClick(event, special = "") {
			if (!(event.target.id != "specialAction" || special)) return;
			
			var used = false;
			
			if (this.item.type == "weapon") {
				used = true;
				
				let modifier = 0;
				
				switch (special) {
					case "aimed":
						modifier = 2;
						break;
					case "quick":
						modifier = -2;
						break;
				}
				
				if (used) {
					openItemRollDialoge(this.item, this.actor, {modifier : modifier});
				}
			}
			
			if (this.item.type == "gear") {
				this.item.sendToChat();
				
				used = true;
			}		
			
			if (this.item.type == "talent") {
				this.item.sendToChat();
			}
			
			if (used) {
				T2KItemButton.consumeActionEconomy(this.item, special);
			}
		}
		
		async specialOptions() {
			let Options = [];
			
			if (game.settings.get(ModuleName, "ShowAimedQuick")) {
				if (this.item.type == "weapon") {
					if (!this.item.system.melee) {
						Options.push({
							text : game.i18n.localize(ModuleName+".Titles.AimedShot"),
							special : "aimed"
						});
						
						Options.push({
							text : game.i18n.localize(ModuleName+".Titles.QuickShot"),
							special : "quick"
						});
					}	
				}
			}
			
			return Options;
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
			
			const specialActions = await this.specialOptions();
			if (specialActions.length > 0) {
				this.element.querySelector("span").id = "maintitle";
				
				for (let i = 0; i < specialActions.length; i++) {
					let Action = specialActions[i];
					let ActionTitle = document.createElement("span");
					ActionTitle.id = "specialAction";
					ActionTitle.classList.add("action-element-title");
					ActionTitle.innerHTML = Action.text;
					ActionTitle.onclick = (event) => {event.stopPropagation(); event.preventDefault(); this._onLeftClick(event, Action.special)};
					ActionTitle.style.visibility = "hidden";
					
					ActionTitle.style.width = `${100/specialActions.length}%`;
					ActionTitle.style.left = `${i * 100/specialActions.length}%`;
					
					ActionTitle.onmouseenter = () => {ActionTitle.style.filter = "brightness(66%)"}
					ActionTitle.onmouseleave = () => {ActionTitle.style.filter = ""}
					
					this.element.appendChild(ActionTitle);
				}
			}
		}

		static consumeActionEconomy(item, special = "") {
			let consumeID = undefined;
			
			if (item.type == "weapon") {
				switch (special) {
					case "aimed":
						consumeAction(3);
						break;
					case "quick":
						consumeAction(1);
						break;
					default:
						consumeAction(2);
						break;
				}
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
				case "gear": return SystemName+".Gear";
				case "talent": 
					switch(this.subtype) {
						case "group" : return SystemName+".TalentCatGroup";
						case "icon" : return SystemName+".TalentCatIcon";
						case "general" : return SystemName+".SheetTalents";
						case "humanite" : return SystemName+".TalentCatHumanite";
						case "cybernetic" : return SystemName+".TalentCatCybernetic";
						case "bionicsculpt" : return SystemName+".TalentCatBionicSculpt";
						case "mysticalpowers" :return SystemName+".TalentCatMysticalPowers"
						default : return SystemName+".SheetTalents";
					}
			}
		}

		get icon() {
			switch (this.type) {
				case "gear": return "modules/enhancedcombathud/icons/svg/backpack.svg";
				case "talent": 
					switch(this.subtype) {
						case "group" : return "modules/enhancedcombathud-t2k4e/icons/team-upgrade.svg";
						case "icon" : return "modules/enhancedcombathud-t2k4e/icons/psychic-waves.svg";
						case "general" : return "icons/svg/book.svg";
						case "humanite" : return "modules/enhancedcombathud-t2k4e/icons/alien-stare.svg";
						case "cybernetic" : return "modules/enhancedcombathud-t2k4e/icons/cyborg-face.svg";
						case "bionicsculpt" : return "modules/enhancedcombathud-t2k4e/icons/techno-heart.svg";
						case "mysticalpowers" :return "modules/enhancedcombathud-t2k4e/icons/glowing-artifact.svg"
						default : return "icons/svg/book.svg";
					}
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
			return 3 - this.item.flags[ModuleName].APconsumption;
		}

		async getTooltipData() {
			const tooltipData = await getTooltipDetails(this.item, this.actor.system.creatureType);
			return tooltipData;
		}
		
		async _onTooltipMouseEnter(event) {
			const tooltipData = await this.getTooltipData();
			if (!tooltipData) return;
			this._tooltip = new T2KTooltip(tooltipData, this.element, this.tooltipOrientation);
			this._tooltip.render();
		}
		
		async _onLeftClick(event) {
			var used = true;
			
			const item = this.item;
			
			if (this.item.system.skill) {
				if (this.actor.system.creatureType == "robot") {
					openRollDialoge("skill", this.item.system.skillRobot, this.actor);
				}
				else {
					openRollDialoge("skill", this.item.system.skill, this.actor);
				}
			}
			
			if (used) {
				T2KSpecialActionButton.consumeActionEconomy(this.item);
			}
		}

		static consumeActionEconomy(item) {
			consumeAction(item.flags[ModuleName].APconsumption);
		}
    }
	
	class T2KMovementHud extends ARGON.MovementHud {

		constructor (...args) {
			super(...args);
			
			this.prevUsedMovement = 0;
		}

		get movementMax() {
			return this.actor.system.movementRate / canvas.scene.dimensions.distance;
		}
		
		get movementUsed() {
			return this._movementUsed;
		}
		
		set movementUsed(value) {
			super._movementUsed = value;
			
			consumeAction(Math.ceil(value/this.movementMax) - Math.ceil(this.prevUsedMovement/this.movementMax));
			
			this.prevUsedMovement = value;
		}
		
	    _onNewRound(combat) {
			super._onNewRound(combat);
			
			this.prevUsedMovement = 0;
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
			let attacks = this.actor.items.filter((item) => item.type === "weapon");
			
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
				if(item?.type != "weapon") return;
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
	
	class T2KTooltip extends ARGON.CORE.Tooltip {
		get template() {
			return `modules/${ModuleName}/templates/T2KTooltip.hbs`; //to add color to subtitles
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
		T2KActionActionPanel,
		T2KFreeActionPanel,
		ARGON.PREFAB.PassTurnPanel
    ]);  
	CoreHUD.defineMovementHud(null);
	CoreHUD.defineMovementHud(T2KMovementHud);
    CoreHUD.defineWeaponSets(T2KWeaponSets);
	CoreHUD.defineSupportedActorTypes(["character", "npc", "ship"]);
});
