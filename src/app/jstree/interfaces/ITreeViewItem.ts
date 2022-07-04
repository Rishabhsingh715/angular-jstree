/**
 * Represents an Item on the TreeView
 * @author (nebiua) Arzan Nebiu
 */
export interface ITreeViewItem<Tag> {
    hasChildren?: boolean;
    id: string;
    name: string;
    parentId: string;
    tag?: Tag;
}
