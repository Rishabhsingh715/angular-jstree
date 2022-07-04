import { IContextItem } from './IContextItem';
import { ITreeViewItem } from './ITreeViewItem';

/**Represents a context menu configuration
 * @field enabled - true to enable, false to disable
 * @field options - contains the configurations
 * @field callback - called when an option has been selected
 * @author (nebiua) Arzan Nebiu
 */
export interface IContextMenu<Tag> {
    enabled: boolean;
    optionClicked: (item: ITreeViewItem<Tag>, option: IContextItem) => void;
    options: IContextItem[];
    optionsAsked?: (item: ITreeViewItem<Tag>, options: IContextItem[]) => IContextItem[];
}
