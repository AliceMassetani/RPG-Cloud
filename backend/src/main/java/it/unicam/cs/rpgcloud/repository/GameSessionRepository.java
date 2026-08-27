package it.unicam.cs.rpgcloud.repository;

import it.unicam.cs.rpgcloud.entity.GameSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for game session persistence.
 */
@Repository
public interface GameSessionRepository extends JpaRepository<GameSessionEntity, String> {

    /**
     * Find all sessions ordered by most recently updated.
     */
    List<GameSessionEntity> findAllByOrderByUpdatedAtDesc();
}
