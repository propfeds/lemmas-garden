/**
 * Image view
 * Reference: https://docs.microsoft.com/en-us/dotnet/api/xamarin.forms.image
 */
export class Image {
    /**
     * @type {Aspect}
     * @public
     */
    public aspect: Aspect;
    /**
     * @type {ImageSource}
     * @public
     */
    public source: ImageSource;
    /**
     * @type {boolean}
     * @public
     */
    public useTint: boolean;
}
import { Aspect } from "./properties/Aspect";
import { ImageSource } from "./properties/ImageSource";
