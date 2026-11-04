import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardWorker } from './card-worker';
import { WORKERS } from '../../core/mocks/workers.mock';

describe('CardWorker', () => {
  let component: CardWorker;
  let fixture: ComponentFixture<CardWorker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWorker],
    }).compileComponents();

    fixture = TestBed.createComponent(CardWorker);
    fixture.componentRef.setInput('worker', WORKERS[0]);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
