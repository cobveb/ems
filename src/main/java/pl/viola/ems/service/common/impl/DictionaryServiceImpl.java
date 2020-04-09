package pl.viola.ems.service.common.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.viola.ems.model.common.Dictionary;
import pl.viola.ems.model.common.repository.DictionaryRepository;
import pl.viola.ems.service.common.DictionaryService;

import java.util.List;
import java.util.Optional;

@Service
public class DictionaryServiceImpl implements DictionaryService {

    @Autowired
    private DictionaryRepository dictionaryRepository;

    @Override
    public List<Dictionary> findAll() {
        return dictionaryRepository.findAll();
    }

    @Override
    public Optional<Dictionary> findById(String code) {
        return dictionaryRepository.findById(code);
    }
}
