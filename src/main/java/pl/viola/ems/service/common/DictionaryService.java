package pl.viola.ems.service.common;

import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.DictionaryItem;

import java.util.List;
import java.util.Optional;

public interface DictionaryService {
    List<Dictionary> findAll();

    Optional<Dictionary> findById(String code);

    List<Dictionary> findByModule(String module);

    DictionaryItem saveDictionaryItem(DictionaryItem dictionaryItem, String dictionaryCode);

    String deleteDictionaryItem(Long itemId);
}
