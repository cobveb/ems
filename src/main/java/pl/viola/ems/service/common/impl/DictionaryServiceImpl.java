package pl.viola.ems.service.common.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.dictionary.Dictionary;
import pl.viola.ems.model.common.dictionary.DictionaryItem;
import pl.viola.ems.model.common.dictionary.repository.DictionaryItemRepository;
import pl.viola.ems.model.common.dictionary.repository.DictionaryRepository;
import pl.viola.ems.service.common.DictionaryService;

import java.util.*;

@Service
public class DictionaryServiceImpl implements DictionaryService {

    @Autowired
    DictionaryRepository dictionaryRepository;

    @Autowired
    DictionaryItemRepository dictionaryItemRepository;

    @Autowired
    MessageSource messageSource;

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
                dictionaries.add("slPoNiUdZp");
                break;
            case "coordinator":
                dictionaries.add("jedMiar");
                break;
            case "hr":
                dictionaries.add("slHrGrZaw");
                dictionaries.add("slHrLoc");
            case "asi":
                dictionaries.add("slAsRegPod");
        }
        return dictionaryRepository.findByCodeIn(dictionaries);
    }

    @Transactional
    @Override
    public DictionaryItem saveDictionaryItem(final DictionaryItem dictionaryItem, final String dictionaryCode) {
        Dictionary dictionary = dictionaryRepository.findById(dictionaryCode)
                .orElseThrow(() -> new AppException("Dictionary.dictionaryNotFound", HttpStatus.NOT_FOUND));
        dictionaryItem.setDictionary(dictionary);
        return dictionaryItemRepository.save(dictionaryItem);
    }

    @Transactional
    @Override
    public String deleteDictionaryItem(final Long itemId) {
        if (dictionaryItemRepository.existsById(itemId)) {
            dictionaryItemRepository.deleteById(itemId);
            return messageSource.getMessage("Coordinator.plan.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Dictionary.dictionaryItemNotFound", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public Set<DictionaryItem> findActiveItemsByDictionary(final String dictionaryCode) {

        return dictionaryItemRepository.findByDictionaryAndIsActiveTrueOrderByName(
                dictionaryRepository.findById(dictionaryCode).orElseThrow(() -> new AppException("Dictionary.dictionaryNotFound", HttpStatus.NOT_FOUND))
        );
    }
}
