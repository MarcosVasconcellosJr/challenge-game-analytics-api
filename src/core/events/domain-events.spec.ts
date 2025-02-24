import { describe, vi } from 'vitest'
import { DomainEvent } from '@/core/events/domain-event'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { DomainEvents } from '@/core/events/domain-events'

class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.occurredAt = new Date()
  }

  public getAggregateId(): string {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot {
  static create() {
    const aggregate = new CustomAggregate()

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }

  toJSON(): any {}
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
