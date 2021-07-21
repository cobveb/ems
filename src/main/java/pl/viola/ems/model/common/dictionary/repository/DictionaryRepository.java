package pl.viola.ems.model.common.dictionary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.dictionary.Dictionary;

import java.util.List;

@Repository
public interface DictionaryRepository extends JpaRepository<Dictionary, String> {
    List<Dictionary> findByCodeIn(List<String> codes);
}
