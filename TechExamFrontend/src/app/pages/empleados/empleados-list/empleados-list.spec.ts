import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadosList } from './empleados-list';

describe('EmpleadosList', () => {
  let component: EmpleadosList;
  let fixture: ComponentFixture<EmpleadosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadosList],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
