import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Creacionayudas } from './creacionayudas';

describe('Creacionayudas', () => {
  let component: Creacionayudas;
  let fixture: ComponentFixture<Creacionayudas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Creacionayudas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Creacionayudas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
