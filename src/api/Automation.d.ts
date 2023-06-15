/**
 * Gather all automation features of the main game.
 * Automation features of theories are contained in the theories themselves.
 */
export class Automation {
    /**
     * @returns {AutoBuyer} Variable auto-buyer
     */
    get variables(): AutoBuyer;
    /**
     * @returns {AutoBuyer} Upgrade auto-buyer
     */
    get upgrades(): AutoBuyer;
    /**
     * @returns {AutoReset} Auto-Prestige
     */
    get prestige(): AutoReset;
    /**
     * @returns {AutoReset} Auto-Supremacy
     */
    get supremacy(): AutoReset;
    /**
     * @returns {number} The number of times the automation features trigger per second.
     */
    get rate(): number;
}
import { AutoBuyer } from "./AutoBuyer";
import { AutoReset } from "./AutoReset";
