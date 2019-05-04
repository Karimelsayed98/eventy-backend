import { PrimaryGeneratedColumn, ManyToOne, Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { EventPlannerEntity } from './eventplanner.entity';
import { EventEntity } from './event.entity';
import { RequestState } from '@core/requests/interfaces/requestState';

@Entity('request')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(type => EventPlannerEntity, planner => planner.pendingRequests)
  public planner: EventPlannerEntity;

  @OneToOne(type => EventEntity)
  @JoinColumn()
  public event: EventEntity;

  @Column()
  public state: RequestState;
}
