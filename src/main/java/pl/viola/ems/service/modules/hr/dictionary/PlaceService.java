package pl.viola.ems.service.modules.hr.dictionary;

import pl.viola.ems.model.modules.hr.dictionary.AbstractPlace;

import java.util.Set;

public interface PlaceService {

    <T extends AbstractPlace> Set<T> getAllPlaces(AbstractPlace.Type type);

    <T extends AbstractPlace> Set<T> getActivePlaces(AbstractPlace.Type type);

    AbstractPlace savePlace(AbstractPlace place);

    String deletePlace(Long placeId);
}
