package pl.viola.ems.service.common.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.repository.DictionaryRepository;
import pl.viola.ems.service.common.DictionaryService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DictionaryServiceImpl implements DictionaryService {

    @Autowired
    DictionaryRepository dictionaryRepository;

    @Override
    public List<Dictionary> findAll() {
        return dictionaryRepository.findAll();
    }

    @Override
    public Optional<Dictionary> findById(String code) {
        return dictionaryRepository.findById(code);
    }

    @Override
    public List<Dictionary> findByModule(String module) {
        List<String> dictionaries = new ArrayList<>();
        switch (module) {
            case "accountant":
                dictionaries.add("dicFunSour");
                break;
            case "publicProcurements":
                dictionaries.add("slAsortGr");
                dictionaries.add("slTryUdzZp");
                break;
            case "coordinator":
                dictionaries.add("jedMiar");
                break;
        }
        return dictionaryRepository.findByCodeIn(dictionaries);
    }
}
