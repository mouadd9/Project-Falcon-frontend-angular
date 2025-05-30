import { Component, EventEmitter, Output } from '@angular/core';
import { faSearch,faRefresh } from '@fortawesome/free-solid-svg-icons';
import { RoomFilterCriteria } from '../../../../state/rooms/rooms.actions';

@Component({
  selector: 'app-rooms-tool-bar',
  standalone: false,
  templateUrl: './rooms-tool-bar.component.html',
  styleUrl: './rooms-tool-bar.component.scss'
})
export class RoomsToolBarComponent {
  @Output() filtersChanged = new EventEmitter<RoomFilterCriteria>();
  
  faSearch = faSearch;
  faRefresh = faRefresh;
  
  currentCriteria: RoomFilterCriteria = {};

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentCriteria.sortBy = target.value as 'NEWEST' | 'MOST_USERS' | undefined;
    this.emitChanges();
  }

  onComplexityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentCriteria.complexity = target.value as 'EASY' | 'MEDIUM' | 'HARD' | undefined;
    this.emitChanges();
  }

  onEnrollmentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentCriteria.enrollmentStatus = target.value as 'ALL' | 'ENROLLED' | 'NOT_ENROLLED';
    this.emitChanges();
  }

  onCompletionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.currentCriteria.completionStatus = target.value as 'ALL' | 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
    this.emitChanges();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentCriteria.searchTerm = target.value;
    this.emitChanges();
  }

  private emitChanges(): void {
    this.filtersChanged.emit({ ...this.currentCriteria });
  }

  clearFilters(): void {
    this.currentCriteria = {};
    this.filtersChanged.emit(this.currentCriteria);
  }
}
