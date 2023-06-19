/**
 * Stack layout
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.stacklayout
 */
export class StackLayout extends Layout {
    /**
     * @type {StackOrientation}
     * @public
     */
    public orientation: StackOrientation;
    /**
     * @type {number}
     * @public
     */
    public spacing: number;
}
import { Layout } from "./Layout";
import { StackOrientation } from "./properties/StackOrientation";
