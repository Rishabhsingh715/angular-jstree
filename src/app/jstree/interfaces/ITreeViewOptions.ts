import { IContextMenu } from './IContextMenu';
import { IDragExternal } from './IDragExternal';
import { IDragAndDrop } from './IDragAndDrop';

/**
 * Represents collection of TreeView configurations
 */
export interface ITreeViewOptions<Tag> {
    contextMenu?: IContextMenu<Tag>;
    dragAndDrop?: IDragAndDrop<Tag>;
    dragExternal?: IDragExternal;
    maxRootChildren?: number;
}
