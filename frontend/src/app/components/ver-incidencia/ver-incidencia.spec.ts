import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerIncidencia } from './ver-incidencia';

describe('VerIncidencia', () => {
  let component: VerIncidencia;
  let fixture: ComponentFixture<VerIncidencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerIncidencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerIncidencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
