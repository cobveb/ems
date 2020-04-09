package pl.viola.ems.service.common;

import pl.viola.ems.model.common.Dictionary;

import java.util.List;
import java.util.Optional;

public interface DictionaryService {
    List<Dictionary> findAll();
    Optional<Dictionary> findById(String code);
}
