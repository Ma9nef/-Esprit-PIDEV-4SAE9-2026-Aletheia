package tn.esprit.microservice.aletheia.service;

import tn.esprit.microservice.aletheia.entity.EventResourceAllocation;

import java.util.List;

public interface EventResourceAllocationService {
    EventResourceAllocation allocateResource(EventResourceAllocation allocation);
    EventResourceAllocation updateAllocation(Long id, EventResourceAllocation allocation);
    void deleteAllocation(Long id);
    EventResourceAllocation getAllocationById(Long id);
    List<EventResourceAllocation> getAllocationsByEvent(Long eventId);
    List<EventResourceAllocation> getAllocationsByResource(Long resourceId);
    boolean checkResourceAvailability(EventResourceAllocation allocation);
    List<EventResourceAllocation> getConflictingAllocations(Long resourceId,
                                                            Long eventId,
                                                            EventResourceAllocation allocation);
    Integer getTotalResourceUsage(Long resourceId);

    List<EventResourceAllocation> getAllAllocations(); // AJOUTER

}