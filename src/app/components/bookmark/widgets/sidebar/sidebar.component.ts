import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardComponent } from "../../../../shared/components/ui/card/card.component";
import { FeatherIconComponent } from "../../../../shared/components/ui/feather-icon/feather-icon.component";
import { BookmarkModalComponent } from '../bookmark-modal/bookmark-modal.component';
import { TagModalComponent } from "../tag-modal/tag-modal.component";

import { bookmarkFilter, bookmarkTags } from '../../../../shared/data/bookmark';
import { user } from '../../../../shared/data/user';
import { Bookmark } from '../../../../shared/interface/bookmark';
import { Tabs } from '../../../../shared/interface/common';

@Component({
  selector: 'app-sidebar',
  imports: [CardComponent, FeatherIconComponent, BookmarkModalComponent, TagModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  @ViewChild("bookmarkModal") BookmarkModal: BookmarkModalComponent;
  @ViewChild("tagModal") TagModal: TagModalComponent;
  
  @Output() currentTab = new EventEmitter<Tabs>();
  @Output() newBookmark = new EventEmitter<Bookmark>();

  public bookmarkFilter = bookmarkFilter;
  public bookmarkTags = bookmarkTags;
  public userDetails = user;
  public filterOpen: boolean = false;

  public activeTab = this.bookmarkFilter[0];

  constructor(private modal: NgbModal) {}

  ngOnInit() {
    this.currentTab.emit(this.activeTab);
  }

  handleTab(item: Tabs) {
    this.activeTab = item;
    this.currentTab.emit(this.activeTab);
  }

  addBookmark() {
    this.modal.open(BookmarkModalComponent, { size: 'lg' });
  }

  handleAddBookmark(bookmark: Bookmark) {
    this.newBookmark.emit(bookmark);
  }

  toggleFilter() {
    this.filterOpen =! this.filterOpen;
  }
}
