import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ITreeViewItem } from './interfaces/ITreeViewItem';
import { ITreeViewOptions } from './interfaces/ITreeViewOptions';
import { IContextItem } from './interfaces/IContextItem';
import { INodeRename } from './interfaces/INodeRename';
import { ILazyLoad } from './interfaces/ILazyLoad';

declare var $: any;

/**
 * Display data as Tree Hierarchy
 * All the data needed, must be provided from the Controller, no data is accepted from the template.
 *
 */
@Component({
  selector: 'tree-view',
  templateUrl: './jstree.component.html',
  styleUrls: []
})
export class TreeViewComponent<Tag> {

  /**
   * Called when a node has been created
   *
   */
  @Output() public created = new EventEmitter<Tag>(false);

  /**
   * Called when a node has been deleted
   *
   */
  @Output() public deleted = new EventEmitter<Tag>(false);

  /**
   * Id on the DOM for the Js Tree Element
   *
   */
  public jsTreeId = '';

  /**
   * Called when a node is asking for children nodes
   *
   */
  @Output() public lazyLoad = new EventEmitter<ILazyLoad<Tag>>(false);

  /**
   * Called when a node has been renamed
   *
   */
  @Output() public renamed = new EventEmitter<INodeRename<Tag>>(false);

  /**
   * Called when a node has been selected
   *
   */
  @Output() public selected = new EventEmitter(false);

  /**
   * Current (Last) datasource
   *
   */
  private currentDataSource: ITreeViewItem<Tag>[] = [];

  /**
   * Reference to Jquery object of Tree
   *
   */
  private treeObj: any;

  constructor() {
    this.jsTreeId = new Date().getTime() + '';
  }

  /**
   * Add a node on the current Tree
   * @param node - Node to add on the Tree
   * @throws undefined if the Tree is destroyed from the DOM
   *
   */
  public create(node: ITreeViewItem<Tag>): void {
    this.currentDataSource.push(node);

    const parentNode = (node.parentId !== '#' && node.parentId !== null)
      ? this.treeObj.get_node(node.parentId, true)
      : '#';

    const nodeToAdd: any = {
      id: node.id,
      parentId: node.parentId,
      text: node.name,
      data: node
    };

    const a = this.treeObj.create_node(parentNode, nodeToAdd); // { "type": "file" });
    this.edit(a);
  }

  /**
   * Delete a node from Tree
   * @param nodeId - The unique Id of the node to be removed from the Tree
   * @throws undefined if the node cannot be found or the Tree has been destroyed from the DOM
   *
   */
  public delete(nodeId: string): void {
    const node = this.treeObj.get_node(nodeId, true);

    const index = this.currentDataSource.findIndex(x => x.id === nodeId);
    this.currentDataSource.splice(index, 1);

    this.treeObj.delete_node(node);
  }

  /**
   * Deselect a node on the tree
   * @param nodeId Node to be deselected
   */
  public deSelect(nodeId: string): void {
    this.treeObj.deselect_node(nodeId);
  }

  /**
   * Enable editing for a node on the Tree
   * If the node is a child, the parent must be expanded for this to work.
   * @param nodeId - Id of the node to be edited
   * @throws undefined if the Tree is destroyed from the DOM
   *
   */
  public edit(nodeId: string): void {
    const node = this.treeObj.get_node(nodeId, true);
    this.treeObj.edit(node);
  }

  /**
   * Get the current data from the Tree
   * @example
   * const currentTreeData = instance.getData();
   * currentTreeData.forEach((element: ITreeViewItem) => console.log(element));
   * @returns Array of a ITreeViewItem (Result will never be null)
   *
   */
  public getData(): ITreeViewItem<Tag>[] {
    // const v = $('#' + this.jsTreeId).jstree(true).get_json('#', { flat: true });

    // const result: ITreeViewItem<Tag>[] = [];
    // v.forEach((element: any) => {
    //   result.push({
    //     id: element.id,
    //     name: element.text,
    //     parentId: element.parent
    //   });
    // });

    // return result;
    return this.currentDataSource;
  }

  /**
   * Get a node from the TreeView
   * @param nodeId Node Id
   *
   */
  public getNode(nodeId: string): ITreeViewItem<Tag> {
    return this.currentDataSource.find(x => x.id === nodeId);
  }

  /**
   * Open a node on the tree
   * @param nodeId Node to be opened
   *
   */
  public open(nodeId: string): void {
    this.treeObj.open_node(nodeId);
  }

  /**
   * Rename a node
   * @param nodeId The id of the node to be renamed
   * @param name New name
   * @throws undefined if the Tree is destroyed from the DOM
   *
   */
  public rename(nodeId: string, name: string): void {
    const node = this.treeObj.get_node(nodeId, true);
    this.treeObj.rename_node(node, name);
  }

  /**
   * Select a node on the tree
   * @param nodeId Node to be selected
   *
   */
  public select(nodeId: string): void {
    this.treeObj.select_node(nodeId);
  }

  /**
   * Set data for current instance.
   * Data must be an array of the @see ITreeViewItem in a flat hierarchy
   * @param data - The data source to generate the tree
   * @param options - Optional options for the current tree instance and data source
   * @param icon - Icon to use for all nodes
   *
   * @throws Undefined if the view has been removed from the DOM
   */
  public setData(data: ITreeViewItem<Tag>[], options: ITreeViewOptions<Tag>, icon = ''): void {
    const self = this;
    // change the ID of JSTree from the TEMP to the GLOBAL Scope one.
    $('[temp-id="' + this.jsTreeId + '"]').attr('id', this.jsTreeId);

    this.currentDataSource = data;
    const list = this.wrapDataForJsTreeDataSource(data);
    const jsTreeOptions: any = {
      core: {
        multiple: false,
        data: (obj: any, cb: any) => {
          if (obj.id === '#') {
            cb.call(this, list);
          } else {
            const callback: ILazyLoad<Tag> = {
              item: obj.data,
              return: d => {
                for (const t of d) {
                  this.currentDataSource.push(t);
                }
                cb.call(this, self.wrapDataForJsTreeDataSource(d));
              }
            };
            self.lazyLoad.emit(callback);
          }
        },
        check_callback: (op: any, node: any, parent: any, pos: any, more: any) => {
          let result = true;
          if (op === 'move_node') {
            if (options.dragAndDrop.move !== null) {
              if (typeof more.ref !== 'undefined' && more.ref !== null && more.ref.data !== null
                && typeof more.ref.data !== 'undefined') {
                result = options.dragAndDrop.move(node.data, more.ref.data, node.parent);
              }
            }
          }
          return result;
        },
        themes: {
          dots: false,
          variant: 'large'
        }
      }
    };

    const plugins = [];
    if (options.dragAndDrop !== null && options.dragAndDrop.enabled) {
      plugins.push('dnd');
    }

    if (icon !== '' || (typeof options.maxRootChildren !== 'undefined' && options.maxRootChildren !== null)) {
      plugins.push('types');
      jsTreeOptions.types = {
        root: {},
        child: {},
        default: {}
      };
      if (icon !== '') {
        jsTreeOptions.types.root.icon = icon;
        jsTreeOptions.types.child.icon = icon;
        jsTreeOptions.types.default.icon = icon;
      }
      if (typeof options.maxRootChildren !== 'undefined' && options.maxRootChildren !== null) {
        jsTreeOptions.types['#'] = { max_children: options.maxRootChildren };
      }
    }

    if (options.contextMenu && options.contextMenu.enabled) {
      plugins.push('contextmenu');

      const createMenuFromContextItems = (items: IContextItem[]) => {
        const menu = {};
        items.forEach((m: IContextItem) => {
          menu[m.title] = {
            label: m.title,
            action(obj: any) {
              const treeItemId = $(obj.reference[0]).parent().attr('id');
              const node = self.getNode(treeItemId);
              options.contextMenu.optionClicked(node, m);
            }
          };
        });
        return menu;
      };

      const contextMenu: any = {};
      contextMenu.items = ($node: any) => {
        if (typeof options.contextMenu.optionsAsked !== 'undefined' && options.contextMenu.optionsAsked !== null) {
          const treeItemId = $node.id;
          const node = self.getNode(treeItemId);
          const r = options.contextMenu.optionsAsked(node, JSON.parse(JSON.stringify(options.contextMenu.options)));
          return createMenuFromContextItems(r);
        }
        return createMenuFromContextItems(options.contextMenu.options);
      };

      jsTreeOptions.contextmenu = contextMenu;
    }

    jsTreeOptions.plugins = plugins;

    // remove listeners
    this.clearListeners();

    $('#' + this.jsTreeId)
      .on('changed.jstree', (e: any, d: any) => {
        const r: ITreeViewItem<Tag>[] = [];
        d.selected.forEach((element: any) => {
          r.push(d.instance.get_node(element).data);
        });

        if (r.length > 0) {
          console.log(r);
          this.selected.emit(r[0]);
        }
      })
      .on('rename_node.jstree', (tree: any, eventData: any) => {
        const dataEvent: INodeRename<Tag> = {
          newName: eventData.text,
          node: eventData.node.data
        };
        this.renamed.emit(dataEvent);
      })
      .on('create_node.jstree', (tree: any, eventData: any) => {
        this.created.emit(eventData.node.data);
      })
      .on('delete_node.jstree', (tree: any, eventData: any) => {
        this.deleted.emit(eventData.node.data);
      })
      .jstree(jsTreeOptions);
    this.treeObj = $('#' + this.jsTreeId).jstree(true);


    // enable drag and drop between NODES
    if (options.dragAndDrop && options.dragAndDrop.enabled) {
      $(document).on('dnd_stop.vakata', (e: any, d: any) => {

        // dropped node
        const n = this.treeObj.get_node(d.element);

        // target node
        const t = $(d.event.target);
        const targetnode = t.closest('.jstree-node');
        const nodeId = targetnode.attr('id');

        const nodeDropped = this.getNode(n.id);
        const toNode = this.getNode(nodeId);
        options.dragAndDrop.drop(nodeDropped, toNode);
      });
    }


    if (options.dragExternal && options.dragExternal.enabled) {
      let lastEl: any = null;
      $('#' + this.jsTreeId).on('dragover', (e: any) => {
        e.preventDefault();
        const dt = e.originalEvent.dataTransfer;
        // commented condition is disabled because we also want to drop HTML elements on NODES
        // if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') !== -1 : dt.types.contains('Files'))) {
        if (e.target.tagName.toLowerCase() === 'a') {
          if (lastEl !== null && lastEl !== e.target) {
            lastEl.classList.remove('jstree-hovered');
            lastEl = null;
          } else if (lastEl !== e.target) {
            lastEl = e.target; // $(e.target).parent();
            lastEl.classList.add('jstree-hovered');
          }
        }
        // }
      }).on('dragleave', (e: any) => {
        e.preventDefault();

        if (lastEl !== null && lastEl !== e.target) {
          lastEl.classList.remove('jstree-hovered');
          lastEl = null;
        }
      }).on('drop', (e: any) => {
        console.log(e);
        if (e.target.tagName.toLowerCase() === 'a') {
          e.preventDefault();
          e.stopPropagation();

          const toNodeId = $(e.target).parent().attr('id');
          const toNode = this.getNode(toNodeId);

          if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            if (options.dragExternal && options.dragExternal.droppedFiles) {
              options.dragExternal.droppedFiles(toNode, e.originalEvent.dataTransfer.files);
            }
          } else {
            if (options.dragExternal && options.dragExternal.droppedHtml) {
              options.dragExternal.droppedHtml(toNode, e.originalEvent.dataTransfer);
            }
          }
        }
      });
    }
  }

  /**
   * Clear created listeners
   *
   */
  private clearListeners(): void {
    $('#' + this.jsTreeId).off('changed.jstree');
    $('#' + this.jsTreeId).off('rename_node.jstree');
    $('#' + this.jsTreeId).off('create_node.jstree');
    $('#' + this.jsTreeId).off('delete_node.jstree');

    $('#' + this.jsTreeId).off('dragover');
    $('#' + this.jsTreeId).off('dragleave');
    $('#' + this.jsTreeId).off('drop');

    $(document).off('dnd_stop.vakata');
  }

  private wrapDataForJsTreeDataSource(data: ITreeViewItem<Tag>[]): any[] {
    const list = [];

    data.forEach((item: ITreeViewItem<Tag>) => {
      const d: any = {
        id: item.id,
        text: item.name,
        data: item,
        parent: item.parentId
      };
      if (typeof item.hasChildren !== 'undefined' && typeof item.hasChildren !== null) {
        d.children = item.hasChildren;
      }
      list.push(d);
    });

    return list;
  }
}
