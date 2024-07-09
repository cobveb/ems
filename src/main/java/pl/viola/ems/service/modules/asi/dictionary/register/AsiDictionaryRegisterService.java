package pl.viola.ems.service.modules.asi.dictionary.register;

import org.springframework.data.domain.Page;
import pl.viola.ems.model.common.export.ExportType;
import pl.viola.ems.model.common.search.SearchConditions;
import pl.viola.ems.model.modules.asi.dictionary.employee.EntitlementSystem;
import pl.viola.ems.model.modules.asi.dictionary.register.DictionaryRegister;
import pl.viola.ems.payload.export.ExportConditions;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface AsiDictionaryRegisterService {
    Page<DictionaryRegister> getAllDictionaryRegisters(SearchConditions conditions, boolean isExport);

    Set<DictionaryRegister> getActiveDictionaryRegisters();

    DictionaryRegister saveDictionaryRegister(DictionaryRegister dictionaryRegister);

    String deleteRegister(Long registerId);

    Set<EntitlementSystem> getRegisterEntitlementSystem(Long registerId);

    List<EntitlementSystem> addRegisterEntitlementSystems(Long registerId, Set<EntitlementSystem> systems);

    String removeRegisterEntitlementSystem(Long registerId, Long systemId);

    void exportRegistersToExcel(ExportType exportType, ExportConditions exportConditions, HttpServletResponse response) throws IOException;

}
