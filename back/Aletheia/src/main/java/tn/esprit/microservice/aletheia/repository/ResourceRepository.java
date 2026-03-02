package tn.esprit.microservice.aletheia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.microservice.aletheia.entity.Resource;
import tn.esprit.microservice.aletheia.entity.ResourceType;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByReusable(Boolean reusable);

    @Query("SELECT r FROM Resource r WHERE r.totalQuantity > 0")
    List<Resource> findAvailableResources();

    @Query("SELECT r FROM Resource r WHERE r.location = :location")
    List<Resource> findByLocation(@Param("location") String location);

    @Query("SELECT r FROM Resource r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Resource> searchByName(@Param("name") String name);
}