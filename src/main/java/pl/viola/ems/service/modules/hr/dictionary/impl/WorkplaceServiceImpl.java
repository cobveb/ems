package pl.viola.ems.service.modules.hr.dictionary.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;
import pl.viola.ems.model.modules.hr.dictionary.Workplace;
import pl.viola.ems.model.modules.hr.dictionary.repository.WorkplaceRepository;
import pl.viola.ems.service.modules.hr.dictionary.WorkplaceService;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class WorkplaceServiceImpl implements WorkplaceService {
    @Autowired
    WorkplaceRepository workplaceRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public Set<Workplace> getAllWorkplaces() {
        return workplaceRepository.findByType(AbstractPlace.Type.WP);
    }

    @Override
    public Set<Workplace> getActiveWorkplaces() {
        return workplaceRepository.findByActiveTrueAndType(AbstractPlace.Type.WP);
    }

    @Transactional
    @Override
    public Workplace saveWorkplaces(final Workplace workplace) {
        return workplaceRepository.save(workplace);
    }

    @Transactional
    @Override
    public String deleteWorkplaces(final Long workplaceId) {
        if (workplaceRepository.existsById(workplaceId)) {
            workplaceRepository.deleteById(workplaceId);
            return messageSource.getMessage("Hr.dictionary.workplace.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Hr.dictionary.workplaceNotFound", HttpStatus.BAD_REQUEST);
        }
    }
}
