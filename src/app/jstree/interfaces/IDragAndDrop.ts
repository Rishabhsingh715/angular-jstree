import { ITreeViewItem } from './ITreeViewItem';

/**
 * Represents Drag and Drop configurations
 * @author (nebiua) Arzan Nebiu
 */
export interface IDragAndDrop<Tag> {
    drop: (node: ITreeViewItem<Tag>, toNode: ITreeViewItem<Tag>) => void;
    enabled: boolean;
    move: (node: ITreeViewItem<Tag>, toNode: ITreeViewItem<Tag>, nodeParent: string) => boolean;
}
