import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightQuickTipsSidebarComponent } from './right-quick-tips-sidebar.component';

describe('RightQuickTipsSidebarComponent', () => {
  let component: RightQuickTipsSidebarComponent;
  let fixture: ComponentFixture<RightQuickTipsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RightQuickTipsSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightQuickTipsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
