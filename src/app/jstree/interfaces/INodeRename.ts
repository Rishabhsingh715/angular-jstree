import { ITreeViewItem } from '../ITreeViewItem';

/**
 * Interface which represents data for a renamed node
 * @author (nebiua) Arzan Nebiu
 */
export interface INodeRename<Tag> {
    newName: string;
    node: ITreeViewItem<Tag>;
}
