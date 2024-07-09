package pl.viola.ems.service.modules.asi.dictionary.register.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import pl.viola.ems.exception.AppException;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.employee.repository.EntitlementSystemRepository;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;
import pl.viola.ems.model.modules.asi.dictionary.register.repository.AsiDictionaryRegisterRepository;
import pl.viola.ems.payload.export.ExportConditions;
import pl.viola.ems.service.modules.asi.dictionary.employee.EntitlementSystemService;
import pl.viola.ems.service.modules.asi.dictionary.register.AsiDictionaryRegisterService;
import pl.viola.ems.utils.Utils;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.*;

@Service
public class AsiDictionaryRegisterServiceImpl implements AsiDictionaryRegisterService {
    @Autowired
    AsiDictionaryRegisterRepository asiDictionaryRegisterRepository;

    @Autowired
    MessageSource messageSource;

    @Autowired
    EntitlementSystemService entitlementSystemService;

    @Autowired
    EntitlementSystemRepository entitlementSystemRepository;

    @Override
    public Page<DictionaryRegister> getAllDictionaryRegisters(final SearchConditions searchConditions, final boolean isExport) {
        return asiDictionaryRegisterRepository.findRegisterPageable(searchConditions.getConditions(), PageRequest.of(
                searchConditions.getPage(),
                searchConditions.getRowsPerPage(),
                searchConditions.getSort().getOrderType() != null ? searchConditions.getSort().getOrderType().equals("desc") ?
                        Sort.by(searchConditions.getSort().getOrderBy()).descending() : Sort.by(searchConditions.getSort().getOrderBy()).ascending() : Sort.by("id")
        ), isExport);
    }

    @Override
    public Set<DictionaryRegister> getActiveDictionaryRegisters() {
        return asiDictionaryRegisterRepository.findByIsActiveTrueOrderByName();
    }

    @Override
    @Transactional
    public DictionaryRegister saveDictionaryRegister(final DictionaryRegister register) {
        return asiDictionaryRegisterRepository.save(register);
    }

    @Override
    @Transactional
    public String deleteRegister(final Long registerId) {
        DictionaryRegister register = asiDictionaryRegisterRepository.findById(registerId).orElseThrow(
                () -> new AppException("Asi.dictionary.register.registerNotFound", HttpStatus.NOT_FOUND)
        );

        entitlementSystemService.getActiveEntitlementSystemsByRegister(register).forEach(entitlementSystem -> entitlementSystem.setRegister(null));

        asiDictionaryRegisterRepository.deleteById(registerId);

        return messageSource.getMessage("Asi.dictionary.register.deleteMsg", null, Locale.getDefault());
    }

    @Override
    public Set<EntitlementSystem> getRegisterEntitlementSystem(final Long registerId) {
        return entitlementSystemService.getActiveEntitlementSystemsByRegister(asiDictionaryRegisterRepository.findById(registerId)
                .orElseThrow(() -> new AppException("Asi.dictionary.register.registerNotFound", HttpStatus.NOT_FOUND)));
    }

    @Override
    @Transactional
    public List<EntitlementSystem> addRegisterEntitlementSystems(final Long registerId, final Set<EntitlementSystem> systems) {
        DictionaryRegister register = asiDictionaryRegisterRepository.findById(registerId).orElseThrow(
                () -> new AppException("Asi.dictionary.register.registerNotFound", HttpStatus.NOT_FOUND)
        );

        if (!systems.isEmpty()) {
            systems.forEach(system -> system.setRegister(register));

        }
        return entitlementSystemRepository.saveAll(systems);
    }

    @Override
    @Transactional
    public String removeRegisterEntitlementSystem(final Long registerId, final Long systemId) {

        DictionaryRegister register = asiDictionaryRegisterRepository.findById(registerId).orElseThrow(
                () -> new AppException("Asi.dictionary.register.registerNotFound", HttpStatus.NOT_FOUND)
        );

        EntitlementSystem entitlementSystem = entitlementSystemRepository.findById(systemId).orElseThrow(
                () -> new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.NOT_FOUND));

        if (entitlementSystemService.getActiveEntitlementSystemsByRegister(register).contains(entitlementSystem)) {
            entitlementSystem.setRegister(null);
            entitlementSystemService.saveEntitlementSystem(entitlementSystem);
        } else {
            throw new AppException("Asi.employee.entitlementSystemNotFound", HttpStatus.BAD_REQUEST);
        }

        return messageSource.getMessage("Asi.dictionary.register.removeEntitlementSystemMsg", null, Locale.getDefault());
    }

    @Override
    public void exportRegistersToExcel(final ExportType exportType, final ExportConditions exportConditions, final HttpServletResponse response) throws IOException {

        ArrayList<Map<String, Object>> rows = new ArrayList<>();

        this.getAllDictionaryRegisters(exportConditions.getSearchConditions(), true).getContent().forEach(register -> {
            Map<String, Object> row = new HashMap<>();
            row.put("name", register.getName());
            row.put("isActive", register.getIsActive());
            rows.add(row);
        });

        Utils.generateExcelExport(exportType, exportConditions.getHeadRows(), rows, response);

    }
}