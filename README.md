# Argon-Twilight: 2000
An implementation of the [Argon - Combat HUD](https://foundryvtt.com/packages/enhancedcombathud) (by [TheRipper93](https://theripper93.com/) and [Mouse0270](https://github.com/mouse0270)) for the [Twilight: 2000](https://foundryvtt.com/packages/t2k4e) system. The Argon Combat HUD (CORE) module is required for this module to work.

![U0shrCV](https://github.com/Saibot393/enhancedcombathud-t2k4e/assets/137942782/dadd189c-87aa-4046-894c-8be1c45fbc0d)

<sup>All icon included in this project are from [Game-icons.net](game-icons.net), used under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) license</sup>

### The documentation for the core argon features can be found [here](https://api.theripper93.com/modulewiki/enhancedcombathud/free)

This module adjusts various Argon features for the Twilight: 2000 system:
- **Portrait**
    - Both hit points and sanity will be displayed at the bottom left
    - The different armor values will be displayed at the bottom right
- **Action tracking** takes the difference of slow and fast actions into account and allows for the use of an available slow action for a fast action
- **Skills and Attributes** Also shows Coolness under Fire and Unit Morale
- **Tooltips** will display quantity, ammunition, damage, rof, crit, blast, range and properties where applicable

Due to licensing i am not able to include official text from the book for the description of the standard actions (help, move, take cover...). The default description of these actions therefore only points to page in the rule book which describes them. Should you wish to customize the description of these actions, you can crate an item (i recommend using a talent) with the name `_argonUI_#ActionID` where `#ActionID` is replaced by the actions id:
- "Persuade" : `Persuade`
- "Grapple" : `Grapple`
- "Break free" : `BreakFree`
- "Clear Jam" : `ClearJam`
- "Aim" : `Aim`
- "First aid" : `FirstAid`
- "Rally" : `Rally`
- "Enter/exit vehicle" : `EnterExit`
- "Seek cover" : `Cover`
- "full to partial cover" : `FulltoPartial`
- "Run" : `Run`
- "Crosss barrier" : `CrossBarier`
- "Get up" : `GetUp`
- "Shove" : `Shove`
- "Disarm" : `Disarm`
- "Grapple attack" : `GrappleAttack`
- "Retreat" : `Retreat`
- "Reload" : `Reload`
- "Drop to ground" : `Drop`
- "Partial to full cover" : `PartialtoFull`

**You need to reload the game to apply the changes to the descriptions!**

Due to the way movement works in Twilight:2000 the Movement Tracker is not (yet?) available to in this implementation.

#### Languages:

The module contains an English and a German translation. If you want additional languages to be supported [let me know](https://github.com/Saibot393/enhancedcombathud-t2k4e/issues).

**If you have suggestions, questions, or requests for additional features please [let me know](https://github.com/Saibot393/enhancedcombathud-t2k4e/issues).**
