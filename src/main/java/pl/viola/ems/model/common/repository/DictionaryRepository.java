package pl.viola.ems.model.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.Dictionary;

@Repository
public interface DictionaryRepository extends JpaRepository<Dictionary, String> {
}
