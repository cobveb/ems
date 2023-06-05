package pl.viola.ems.service.modules.hr.dictionary.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;
import pl.viola.ems.model.modules.hr.dictionary.Place;
import pl.viola.ems.model.modules.hr.dictionary.Workplace;
import pl.viola.ems.model.modules.hr.dictionary.repository.PlaceRepository;
import pl.viola.ems.model.modules.hr.dictionary.repository.WorkplaceRepository;
import pl.viola.ems.service.modules.hr.dictionary.PlaceService;

import java.util.Locale;
import java.util.Set;

@Service
public class PlaceServiceImpl implements PlaceService {

    @Autowired
    PlaceRepository placeRepository;

    @Autowired
    WorkplaceRepository workplaceRepository;

    @Autowired
    MessageSource messageSource;


    @Override
    public <T extends AbstractPlace> Set<T> getAllPlaces(final AbstractPlace.Type type) {
        return type.equals(AbstractPlace.Type.PL) ?
                (Set<T>) placeRepository.findByType(type) : (Set<T>) workplaceRepository.findByType(type);
    }

    @Override
    public <T extends AbstractPlace> Set<T> getActivePlaces(final AbstractPlace.Type type) {
        return type.equals(AbstractPlace.Type.PL) ?
                (Set<T>) placeRepository.findByActiveTrueAndType(type) : (Set<T>) workplaceRepository.findByActiveTrueAndType(type);
    }

    @Transactional
    @Override
    public AbstractPlace savePlace(final AbstractPlace place) {
        return place.getType().equals(AbstractPlace.Type.PL) ?
                placeRepository.save((Place) place) : workplaceRepository.save((Workplace) place);
    }

    @Transactional
    @Override
    public String deletePlace(final Long placeId) {

        if (placeRepository.existsById(placeId)) {
            placeRepository.deleteById(placeId);
            return messageSource.getMessage("Hr.dictionary.place.deleteMsg", null, Locale.getDefault());
        } else {
            throw new AppException("Hr.dictionary.placeNotFound", HttpStatus.BAD_REQUEST);
        }
    }
}
