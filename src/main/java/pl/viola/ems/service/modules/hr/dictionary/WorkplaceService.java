package pl.viola.ems.service.modules.hr.dictionary;

import pl.viola.ems.model.modules.hr.dictionary.Workplace;

import java.util.Set;

public interface WorkplaceService {

    Set<Workplace> getAllWorkplaces();

    Set<Workplace> getActiveWorkplaces();

    Workplace saveWorkplaces(Workplace workplace);

    String deleteWorkplaces(Long workplaceId);
}
