package pl.viola.ems.model.common.dictionary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

@Repository
public interface DictionaryItemRepository extends JpaRepository<DictionaryItem, Long> {
}
