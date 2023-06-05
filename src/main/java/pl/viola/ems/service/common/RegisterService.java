package pl.viola.ems.service.common;

import pl.viola.ems.model.common.register.Register;
import pl.viola.ems.model.common.register.RegisterPosition;

import java.util.Set;

public interface RegisterService {
    Set<Register> getRegisters(String module);

    <T extends RegisterPosition> Set<T> getRegisterPositions(String registerCode);

    <T extends RegisterPosition> Set<T> getActivePositionsByRegister(String registerCode);

    Register saveRegister(Register register);

    RegisterPosition saveRegisterPosition(String registerCode, RegisterPosition position);

    String deleteRegisterPosition(String registerCode, Long positionId);


}
