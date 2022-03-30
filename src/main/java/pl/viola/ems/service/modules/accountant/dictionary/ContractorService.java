package pl.viola.ems.service.modules.accountant.dictionary;

import pl.viola.ems.model.modules.accountant.dictionary.Contractor;

import java.util.List;

public interface ContractorService {
    List<Contractor> getContractors();

    List<Contractor> getActiveContractor();

    Contractor saveContractor(Contractor contractor);

    String deleteContractor(Long id);

}
