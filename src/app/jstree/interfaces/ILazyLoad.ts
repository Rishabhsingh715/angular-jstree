import { ITreeViewItem } from './ITreeViewItem';

/**
 * Represents a model when a lazy load is required
 * @author (nebiua) Arzan Nebiu
 */
export interface ILazyLoad<Tag> {
    item: ITreeViewItem<Tag>;
    return: (data: ITreeViewItem<Tag>[]) => void;
}
