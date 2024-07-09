package pl.viola.ems.model.modules.asi.dictionary.register.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.viola.ems.model.common.search.SearchCondition;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;

import java.util.List;

public interface AsiDictionaryRegisterCustomRepository {
    Page<DictionaryRegister> findRegisterPageable(List<SearchCondition> conditions, Pageable pageable, Boolean isExport);
}
