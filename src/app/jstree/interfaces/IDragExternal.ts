import { ITreeViewItem } from '../components/ecap-tree-view/interfaces/ITreeViewItem';

/**
 * Configuration object for the Drag Local Files
 * @author (nebiua) Arzan Nebiu
 */
export interface IDragExternal {
    droppedFiles?: (node: ITreeViewItem<any>, files: FileList) => void;
    droppedHtml?: (node: ITreeViewItem<any>, data: DataTransfer) => void;
    enabled: boolean;
}
