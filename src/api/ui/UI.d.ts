/**
 * Class to create UI elements
 */
export class UI {
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {ActivityIndicator}
     */
    createActivityIndicator(parameters: {
        [x: string]: any;
    }): ActivityIndicator;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Box}
     */
    createBox(parameters: {
        [x: string]: any;
    }): Box;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Button}
     */
    createButton(parameters: {
        [x: string]: any;
    }): Button;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {CheckBox}
     */
    createCheckBox(parameters: {
        [x: string]: any;
    }): CheckBox;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Entry}
     */
    createEntry(parameters: {
        [x: string]: any;
    }): Entry;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Frame}
     */
    createFrame(parameters: {
        [x: string]: any;
    }): Frame;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Grid}
     */
    createGrid(parameters: {
        [x: string]: any;
    }): Grid;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Image}
     */
    createImage(parameters: {
        [x: string]: any;
    }): Image;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Label}
     */
    createLabel(parameters: {
        [x: string]: any;
    }): Label;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {LatexLabel}
     */
    createLatexLabel(parameters: {
        [x: string]: any;
    }): LatexLabel;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Popup}
     */
    createPopup(parameters: {
        [x: string]: any;
    }): Popup;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {ProgressBar}
     */
    createProgressBar(parameters: {
        [x: string]: any;
    }): ProgressBar;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Slider}
     */
    createSlider(parameters: {
        [x: string]: any;
    }): Slider;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {ScrollView}
     */
    createScrollView(parameters: {
        [x: string]: any;
    }): ScrollView;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {StackLayout}
     */
    createStackLayout(parameters: {
        [x: string]: any;
    }): StackLayout;
    /**
     * @param {Object.<string,Object>} parameters
     * @returns {Switch}
     */
    createSwitch(parameters: {
        [x: string]: any;
    }): Switch;
    /**
     * Screen width adjusted to density (realScreenWidth / screenDensity)
     * Use this value to decide on the size of controls
     * to make it visually uniform across device.
     * @returns {number}
     */
    get screenWidth(): number;
    /**
     * Screen height adjusted to density (realScreenHeight / screenDensity)
     * Use this value to decide on the size of controls
     * to make it visually uniform across device.
     * @returns {number}
     */
    get screenHeight(): number;
    /**
     * Scale factor dependent on the physical pixel size of the device.
     * @returns {number}
     */
    get screenDensity(): number;
    /**
     * Number of horizontal pixels on the screen
     * @returns {number}
     */
    get realScreenWidth(): number;
    /**
     * Number of vertical pixels on the screen
     * @returns {number}
     */
    get realScreenHeight(): number;
    /**
     * Display a popup with the custom theory achievement.
     * Cannot be display while calculating offline progress or
     * if there are no achievements.
     */
    showCustomTheoryAchievements(): any;
    /**
     * Display a popup with the custom theory story chapters.
     * Cannot be display while calculating offline progress or
     * if there are no story chapters.
     */
    showCustomTheoryStory(): any;
}
/**
 * Instance of the UI.
 * @type {UI}
 */
export const ui: UI;
import { ActivityIndicator } from "./ActivityIndicator";
import { Box } from "./Box";
import { Button } from "./Button";
import { CheckBox } from "./CheckBox";
import { Entry } from "./Entry";
import { Frame } from "./Frame";
import { Grid } from "./Grid";
import { Image } from "./Image";
import { Label } from "./Label";
import { LatexLabel } from "./LatexLabel";
import { Popup } from "./Popup";
import { ProgressBar } from "./ProgressBar";
import { Slider } from "./Slider";
import { ScrollView } from "./ScrollView";
import { StackLayout } from "./StackLayout";
import { Switch } from "./Switch";
