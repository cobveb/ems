package pl.viola.ems.model.common.dictionary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import java.util.Set;

@Repository
public interface DictionaryItemRepository extends JpaRepository<DictionaryItem, Long> {
    Set<DictionaryItem> findByDictionaryAndIsActiveTrueOrderByName(Dictionary dictionary);
}
