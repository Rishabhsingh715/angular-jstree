import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { TreeViewComponent } from './jstree/jstree.component';
import { ITreeViewOptions } from './jstree/interfaces/ITreeViewOptions';
import { ITreeViewItem } from './jstree/interfaces/ITreeViewItem';
import { IContextItem } from './jstree/interfaces/IContextItem';
import { ILazyLoad } from './jstree/interfaces/ILazyLoad';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('treeView', { static: false })
  public treeView: TreeViewComponent<string>;

  ngAfterViewInit() {
    const options: ITreeViewOptions<string> = {
      dragAndDrop: {
        enabled: true,
        move: (
          node: ITreeViewItem<string>,
          toNode: ITreeViewItem<string>,
          parent: string
        ) => {
          return true;
        },
        drop: (node: ITreeViewItem<string>, toNode: ITreeViewItem<string>) => {
          console.log('node', node);
          console.log('to node', toNode);
        },
      },
      dragExternal: {
        enabled: true,
        droppedFiles: (node: ITreeViewItem<string>, files: FileList) => {
          console.log(node, files);
        },
        droppedHtml: (node: ITreeViewItem<string>, data: DataTransfer) => {
          console.log(node, data);

          for (const t of data.types) {
            console.log(t, data.getData(t));
          }
        },
      },
      contextMenu: {
        enabled: true,
        optionClicked: (item: ITreeViewItem<string>, option: IContextItem) => {
          console.log(option,'kkkkkkkk')
          switch (option.tag) {
            case 'create':
              this.treeView.create({
                id: '34',
                name: 'Just created',
                parentId: item.parentId,
              });
              break;
            case 'rename':
              this.treeView.edit(item.id);
              break;
            case 'delete':
              this.treeView.delete(item.id);
              break;
          }
        },
        optionsAsked: (item: any, arr: any) => {
          console.log(item);
          console.log(arr);
          //arr.splice(0, 1);
          return arr;
        },
        options: [
          {
            tag: 'rename',
            title: 'Rename',
          },
          {
            tag: 'rename',
            title: 'Rename',
          },
          {
            tag: 'create',
            title: 'Create',
          },
          {
            tag: 'delete',
            title: 'Delete',
          },
        ],
      },
      maxRootChildren: 10,
    };

    // calling setData out of setTimeout will be all ok, but on this case, DND has issues.
    setTimeout(() => {
      this.treeView.setData(
        [
          { 
            id: '1',
            name: 'Hello',
            parentId: '#',
            tag: 'I am tag one',
          },
          {
            id: '4',
            name: 'ff',
            parentId: '#',
            tag: 'I am tag one',
          },
          {
            id: '42',
            name: 'Folder 2',
            parentId: '4',
            tag: 'I am tag two',
            hasChildren: true,
          },
          {
            id: '2',
            name: 'Folder 2',
            parentId: '1',
            tag: 'I am tag two',
            hasChildren: true,
          },
          {
            id: '3',
            name: 'Folder 3',
            parentId: '1',
            tag: 'I am tag three',
            hasChildren: true,
          },
        ],
        options
      );
    });

    this.treeView.lazyLoad.subscribe((e: ILazyLoad<any>) => {
      console.log(e);
      setTimeout(() => {
        e.return([
          {
            id: new Date().getMilliseconds().toString(),
            name: 'ASD',
            parentId: e.item.id,
          },
        ]);
      });
    });

    this.treeView.selected.subscribe((event) => console.log('selected', event));
    this.treeView.created.subscribe((event) => console.log('selected', event));
    this.treeView.renamed.subscribe((event) => console.log('renamed', event));
    this.treeView.deleted.subscribe((event) => console.log('deleted', event));
  }
}
