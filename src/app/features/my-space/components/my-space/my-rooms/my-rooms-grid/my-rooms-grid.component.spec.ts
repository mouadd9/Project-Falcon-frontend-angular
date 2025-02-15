import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoomsGridComponent } from './my-rooms-grid.component';

describe('MyRoomsGridComponent', () => {
  let component: MyRoomsGridComponent;
  let fixture: ComponentFixture<MyRoomsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRoomsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRoomsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
