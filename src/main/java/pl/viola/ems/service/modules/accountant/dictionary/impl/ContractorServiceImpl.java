package pl.viola.ems.service.modules.accountant.dictionary.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.modules.accountant.dictionary.Contractor;
import pl.viola.ems.model.modules.accountant.dictionary.repository.ContractorRepository;
import pl.viola.ems.service.modules.accountant.dictionary.ContractorService;

import java.util.List;
import java.util.Locale;

@Service
public class ContractorServiceImpl implements ContractorService {
    @Autowired
    ContractorRepository contractorRepository;

    @Autowired
    MessageSource messageSource;

    @Override
    public List<Contractor> getContractors() {
        return contractorRepository.findAll();
    }

    @Override
    public List<Contractor> getActiveContractor() {
        return contractorRepository.findByActiveTrue();
    }

    @Override
    public Contractor saveContractor(Contractor contractor) {
        return contractorRepository.save(contractor);
    }

    @Override
    public String deleteContractor(Long id) {
        if (!contractorRepository.existsById(id)) {
            throw new AppException("Accountant.contractor.notFound", HttpStatus.BAD_REQUEST);
        }

        contractorRepository.deleteById(id);

        return messageSource.getMessage("Accountant.contractor.deleteMsg", null, Locale.getDefault());
    }
}
